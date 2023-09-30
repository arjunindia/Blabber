import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { Elysia, t } from "elysia";
import { authed } from "../auth/middleware";
import { EditTweet, Tweet } from "../components/tweets";
import { ctx } from "../context";
import { tweets, user } from "../db/schema";

export const tweetsController = new Elysia({
  prefix: "/tweets",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get("/", async ({ session, db }) => {
    let authenticated = false;
    let currUser: any;
    if (session) {
      currUser = session.user;
      const username = user.username;
      authenticated = true;
    }
    if (session) {
      currUser = session.user;
      const username = user.username;
      authenticated = true;
    }
    const replies = alias(tweets, "replies");
    const replyAuthor = alias(user, "replyAuthor");
    const tweetList = await db
      .select({
        id: tweets.id,
        content: tweets.content,
        createdAt: tweets.createdAt,
        name: user.name,
        username: user.username,
        verified: user.verified,
        verificationMessage: user.verificationMessage,
        replyMessage: replies.content,
        replyUser: replyAuthor.username,
        replyId: replies.id,
        images: tweets.image,
      })
      .from(tweets)
      .orderBy(desc(tweets.createdAt))
      .innerJoin(user, eq(tweets.authorId, user.id))
      .leftJoin(replies, eq(tweets.replyTo, replies.id))
      .leftJoin(replyAuthor, eq(replies.authorId, replyAuthor.id));
    return (
      <div class="mx-8 flex h-min flex-[2] flex-col gap-6 py-6" id="tweets">
        <div class="flex items-center justify-between">
          <h1 class="text-text block flex-1 pl-8 text-2xl font-bold sm:hidden">
            Blabber
          </h1>
          {!authenticated && (
            <a
              href="/auth/signup"
              class="bg-primary hover:bg-primaryDark text-text rounded-full p-4 px-8 text-xl sm:hidden"
            >
              Signup
            </a>
          )}
        </div>
        {authenticated && <EditTweet currUser={currUser} />}
        {tweetList.length > 0 ? (
          tweetList.map((tweet) => (
            <Tweet
              id={tweet.id}
              content={tweet.content}
              createdAt={tweet.createdAt}
              name={tweet.name}
              username={tweet.username}
              verified={tweet.verified}
              verificationMessage={tweet.verificationMessage || ""}
              owner={tweet.username === currUser?.username}
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
          ))
        ) : (
          <p class="text-text">No tweets yet</p>
        )}
      </div>
    );
  });
