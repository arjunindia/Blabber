import { Suspense } from "beth-stack/jsx";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { Elysia, t } from "elysia";
import { authed } from "../../auth/middleware";
import { BaseHtml } from "../../components/base";
import { Profile } from "../../components/Profile/Profile";
import { Sidebar, SideColumn } from "../../components/Sidebar";
import { EditTweet, Tweet } from "../../components/tweets";
import { ctx } from "../../context";
import { user } from "../../db/schema/auth";
import { tweets } from "../../db/schema/tweets";

export const userPage = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get(
    "/:username",
    async ({ htmlStream, params: { username }, session, db }) => {
      const authenticated = !!session;
      const siteUser = (
        await db
          .select({
            username: user.username,
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            website: user.website,
            verified: user.verified,
            verificationMessage: user.verificationMessage,
          })
          .from(user)
          .where(eq(user.username, username))
      )[0];

      if (!siteUser) {
        return htmlStream(() => (
          <BaseHtml>
            <Sidebar authenticated={authenticated} />
            <div class="flex flex-1 flex-col items-center justify-center">
              <h1 class="text-4xl font-bold">User not found</h1>
              <p class="text-gray-500">
                The user you are looking for does not exist.
              </p>
            </div>
            <SideColumn />
          </BaseHtml>
        ));
      }

      const replyTable = alias(tweets, "replyTable");
      const replyUser = alias(user, "replyUser");
      const tweetFetch = await db
        .select({
          id: tweets.id,
          content: tweets.content,
          createdAt: tweets.createdAt,
          name: user.name,
          username: user.username,
          verified: user.verified,
          verificationMessage: user.verificationMessage,
          replyMessage: replyTable.content,
          replyUser: replyUser.username,
          replyId: replyTable.id,
          images: tweets.image,
        })
        .from(tweets)
        .where(eq(tweets.authorId, siteUser.id))
        .innerJoin(user, eq(tweets.authorId, user.id))
        .orderBy(desc(tweets.createdAt))
        .leftJoin(replyTable, eq(replyTable.id, tweets.replyTo))
        .leftJoin(replyUser, eq(replyTable.authorId, replyUser.id));

      if (!tweetFetch) {
        return htmlStream(() => (
          <BaseHtml>
            <Sidebar authenticated={authenticated} />
            <div class="flex flex-1 flex-col items-center justify-center">
              <h1 class="text-4xl font-bold">User not found</h1>
              <p class="text-gray-500">
                The user you are looking for does not exist.
              </p>
            </div>
            <SideColumn />
          </BaseHtml>
        ));
      }
      const tweetList = tweetFetch.map((tweet) => (
        <Tweet
          id={tweet.id}
          content={tweet.content}
          createdAt={tweet.createdAt}
          name={tweet.name}
          username={tweet.username}
          verified={tweet.verified}
          verificationMessage={tweet.verificationMessage || ""}
          owner={tweet.username === session?.user?.username}
          ReplyMessage={tweet.replyMessage}
          ReplyUser={tweet.replyUser}
          ReplyId={tweet.replyId}
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
      ));
      return htmlStream(() => (
        <BaseHtml className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden">
          <Sidebar authenticated={authenticated} />
          <Profile
            user={siteUser}
            tweetList={tweetList}
            owner={username === session?.user?.username}
          />
          <SideColumn />
        </BaseHtml>
      ));
    },
    {
      params: t.Object({
        username: t.String(),
      }),
    },
  );
