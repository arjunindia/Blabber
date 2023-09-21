import { Context } from "elysia";
import BaseHtml from "../../BaseHTML";
import { SideColumn, Sidebar } from "../../components/Sidebar";
import { auth } from "../auth/lucia";
import { db } from "../../db";
import { user } from "../../db/schema/userSchema";
import { like, eq, desc } from "drizzle-orm";
import { tweets } from "../../db/schema/tweetSchema";
import { alias } from "drizzle-orm/sqlite-core";
import { Tweet } from "../../components/Tweet";

export const get = async (context: Context) => {
  const { request } = context;
  let authenticated: boolean = false;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    authenticated = true;
  }

  const urlparams = new URLSearchParams(request.url.split("?")[1]);
  const searchQuery = urlparams.get("q");

  const results = await db
    .select()
    .from(user)
    .where(like(user.name, "%" + searchQuery + "%"))
    .limit(10);

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
    })
    .from(tweets)
    .where(like(tweets.content, "%" + searchQuery + "%"))
    .orderBy(desc(tweets.createdAt))
    .innerJoin(user, eq(tweets.authorId, user.id))
    .leftJoin(replies, eq(tweets.replyTo, replies.id))
    .leftJoin(replyAuthor, eq(replies.authorId, replyAuthor.id));
  console.log(results, tweetList);
  return (
    <BaseHtml>
      <body class="flex w-screen overflow-x-hidden min-h-screen justify-center bg-background">
        <Sidebar authenticated={authenticated} />
        <div class="flex-[2] p-5">
          <div class="flex flex-col justify-start rounded-xl shadow-xl hover:shadow-sm transition-all p-4 gap-3">
            <h1 class="text-text font-bold text-4xl">Search</h1>
            <h2 class="text-text font-thin mt-8 text-xl">Tweets</h2>
            {tweetList.map((tweet) => (
              <Tweet
                id={tweet.id}
                content={tweet.content}
                createdAt={tweet.createdAt}
                name={tweet.name}
                username={tweet.username}
                verified={tweet.verified}
                verificationMessage={tweet.verificationMessage || ""}
                owner={tweet.username === session?.user?.username}
                ReplyMessage={tweet.replyMessage || undefined}
                ReplyUser={tweet.replyUser || undefined}
                ReplyId={tweet.replyId || undefined}
                className="h-min flex-shrink"
              />
            ))}
          </div>
        </div>
        <SideColumn />
      </body>
    </BaseHtml>
  );
};
