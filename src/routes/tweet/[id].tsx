import { Context } from "elysia";
import { Tweet } from "../../components/Tweet";
import { db } from "../../db";
import { tweets } from "../../db/schema/tweetSchema";
import { user } from "../../db/schema/userSchema";
import { auth } from "../auth/lucia";
import { eq } from "drizzle-orm";
import BaseHtml from "../../BaseHTML";
import { SideColumn, Sidebar } from "../../components/Sidebar";
import { alias } from "drizzle-orm/sqlite-core";

const EditTweet = ({
  currUser,
  replyId,
}: {
  currUser: any;
  replyId: string;
}) => (
  <div class="flex flex-1 gap-6 w-full h-min p-8 rounded-2xl bg-secondary">
    <img
      class="rounded-full hidden sm:block w-0 h-0 sm:w-8 sm:h-8"
      width="32"
      height="32"
      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${currUser.username}`}
    />
    <div class="flex flex-col gap-2 w-full">
      <textarea
        type="text"
        class="w-full bg-transparent text-text h-32 rounded-xl"
        placeholder="What's happening?"
        maxlength="300"
        required="true"
        name="content"
        id="replyArea"
        _={`
              on input set :contentvalue to 300 - me.value.length then log :contentvalue then put :contentvalue into #tweetlength
              if :contentvalue < 0 then
                add .text-red-500 to #tweetlength
                remove .text-green-500 from #tweetlength
              else
                remove .text-red-500 from #tweetlength
                add .text-green-500 to #tweetlength
              end
            `}
      />
      <p id="tweetlength" class="ml-auto"></p>
      <div class="flex flex-row gap-5 mt-4 justify-between">
        <button class="text-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </button>
        <button
          class="text-text px-6 py-3 bg-primary rounded-full"
          hx-post={`/tweets/reply/${replyId}`}
          hx-swap="outerHTML"
          hx-include="#replyArea"
          hx-target="#tweet-error"
        >
          Post
        </button>
      </div>
      <p class="text-red-500 text-sm" id="tweet-error"></p>
    </div>
  </div>
);

export const get = async (context: Context) => {
  const { request } = context;
  const { id } = context.params as { id: string };
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  let authenticated = false;
  if (session) {
    authenticated = true;
  }
  const repliesTable = alias(tweets, "replies");
  const repliesUser = alias(user, "repliesUser");
  const tweet = await db
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
    .where(eq(tweets.id, id))
    .innerJoin(user, eq(user.id, tweets.authorId))
    .leftJoin(repliesTable, eq(repliesTable.id, tweets.replyTo))
    .leftJoin(repliesUser, eq(repliesUser.id, repliesTable.authorId));

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
    .where(eq(tweets.replyTo, id))
    .innerJoin(user, eq(user.id, tweets.authorId))
    .leftJoin(repliesTable, eq(repliesTable.id, tweets.replyTo))
    .leftJoin(repliesUser, eq(repliesUser.id, repliesTable.authorId));

  return (
    <BaseHtml
      title={`${tweet[0].name} (@${tweet[0].username}) / Tweet`}
      description={tweet[0].content}
      image={
        tweet[0].images
          ? JSON.parse(tweet[0].images)[0]
          : `https://blabber.fly.dev/public/icon.jpg`
      }
      keywords={`${tweet[0].name}, ${tweet[0].username}, ${tweet[0].content},blabber, social media, twitter, facebook, instagram, social network, share, thoughts`}
      url={`https://blabber.fly.dev/tweet/${id}`}
    >
      <body class="flex w-screen overflow-x-hidden min-h-screen justify-center bg-background">
        <Sidebar authenticated={authenticated} />
        <div class="flex-[2] py-4 px-3">
          <h1 class="text-text text-4xl font-bold py-4">Tweet</h1>

          <Tweet
            {...tweet[0]}
            ReplyMessage={tweet[0].ReplyMessage || ""}
            ReplyUser={tweet[0].ReplyUser || ""}
            ReplyId={tweet[0].replyId || ""}
            owner={session && session?.user?.username === tweet[0].username}
            images={
              tweet[0].images
                ? (JSON.parse(tweet[0].images) as [any])
                : undefined
            }
          />
          <div class="flex flex-col gap-4">
            <h1 class="text-text text-2xl font-bold mt-6">Replies</h1>
            {authenticated ? (
              <EditTweet currUser={session?.user} replyId={id} />
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
                  reply.images ? (JSON.parse(reply.images) as [any]) : undefined
                }
              />
            ))}
          </div>
        </div>
        <SideColumn />
      </body>
    </BaseHtml>
  );
};
