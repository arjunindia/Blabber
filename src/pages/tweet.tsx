import { Suspense } from "beth-stack/jsx";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { Elysia, t } from "elysia";
import { authed } from "../auth/middleware";
import { BaseHtml } from "../components/base";
import { Sidebar, SideColumn } from "../components/Sidebar";
import { EditTweet, Tweet } from "../components/tweets";
import { ctx } from "../context";
import { user } from "../db/schema/auth";
import { tweets } from "../db/schema/tweets";

export const tweet = new Elysia({
  prefix: "/tweet",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get(
    "/:id",
    async ({ htmlStream, params, session, db }) => {
      const authenticated = !!session;
      const repliesTable = alias(tweets, "replies");
      const repliesUser = alias(user, "repliesUser");
      const tweetsList = await db
        .select({
          id: tweets.id,
          content: tweets.content,
          createdAt: tweets.createdAt,
          name: user.name,
          username: user.username,
          verified: user.verified,
          verificationMessage: user.verificationMessage,
          ReplyMessage: repliesTable.content,
          ReplyUser: repliesUser.username,
          replyId: repliesTable.id,
          images: tweets.image,
        })
        .from(tweets)
        .where(eq(tweets.id, params.id))
        .innerJoin(user, eq(user.id, tweets.authorId))
        .leftJoin(repliesTable, eq(repliesTable.id, tweets.replyTo))
        .leftJoin(repliesUser, eq(repliesUser.id, repliesTable.authorId))
        .limit(1);

      const tweet = tweetsList[0];

      const replies = await db
        .select({
          id: tweets.id,
          content: tweets.content,
          createdAt: tweets.createdAt,
          name: user.name,
          username: user.username,
          verified: user.verified,
          verificationMessage: user.verificationMessage,
          ReplyMessage: repliesTable.content,
          ReplyUser: repliesUser.username,
          replyId: repliesTable.id,
          images: tweets.image,
        })
        .from(tweets)
        .where(eq(tweets.replyTo, params.id))
        .innerJoin(user, eq(user.id, tweets.authorId))
        .leftJoin(repliesTable, eq(repliesTable.id, tweets.replyTo))
        .leftJoin(repliesUser, eq(repliesUser.id, repliesTable.authorId));

      //  check if tweet , replies exist
      if (!tweet || !replies) {
        return htmlStream(() => (
          <BaseHtml className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden">
            <Sidebar authenticated={authenticated} />
            <div class="flex-[2] px-3 py-4">
              <h1 class="text-text py-4 text-4xl font-bold">Tweet</h1>
              <p class="text-text text-center">
                This tweet does not exist.{" "}
                <a href="/" class="text-link">
                  Go back home
                </a>
              </p>
            </div>
            <SideColumn />
          </BaseHtml>
        ));
      }

      return htmlStream(() => (
        <BaseHtml className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden pb-8">
          <Sidebar authenticated={authenticated} />
          <div class="flex-[2] px-3 py-8">
            <h1 class="text-text py-4 text-4xl font-bold">Tweet</h1>

            <Tweet
              {...tweet}
              ReplyMessage={tweet.ReplyMessage || ""}
              ReplyUser={tweet.ReplyUser || ""}
              ReplyId={tweet.replyId || ""}
              owner={session && session?.user?.username === tweet.username}
              images={
                tweet.images
                  ? (JSON.parse(tweet.images) as [
                      {
                        url: string;
                        deleteUrl: string;
                        width: number;
                        height: number;
                      },
                    ])
                  : null
              }
            />
            <div class="flex flex-col gap-4">
              <h1 class="text-text mt-6 text-2xl font-bold">Replies</h1>
              {authenticated ? (
                <EditTweet currUser={session?.user} replyId={params.id} />
              ) : (
                <p class="text-text text-center">
                  You must be{" "}
                  <a href="/auth/login" class="text-link">
                    logged in
                  </a>{" "}
                  to reply to a tweet.
                </p>
              )}
              {replies.map((reply) => (
                <Tweet
                  {...reply}
                  ReplyMessage={reply.ReplyMessage || ""}
                  ReplyUser={reply.ReplyUser || ""}
                  ReplyId={reply.replyId || ""}
                  owner={session && session?.user?.username === reply.username}
                  images={
                    reply.images
                      ? (JSON.parse(reply.images) as [
                          {
                            url: string;
                            deleteUrl: string;
                            width: number;
                            height: number;
                          },
                        ])
                      : null
                  }
                />
              ))}
            </div>
          </div>
          <SideColumn />
        </BaseHtml>
      ));
    },
    { params: t.Object({ id: t.String() }) },
  );
