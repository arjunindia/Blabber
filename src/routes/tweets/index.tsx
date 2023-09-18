import type { Context } from "elysia";
import { auth } from "../auth/lucia";
import { db } from "../../db";
import { user } from "../../db/schema/userSchema";
import { tweets, TweetInsert, tweetLikes } from "../../db/schema/tweetSchema";
import { desc, eq, sql } from "drizzle-orm";
import { Tweet } from "../../components/Tweet";
import { alias } from "drizzle-orm/sqlite-core";
const EditTweet = ({ currUser }: { currUser: any }) => (
  <div class="flex flex-1 gap-6 w-full h-min p-8 rounded-2xl bg-secondary">
    <img
      class="rounded-full w-8 h-8 sm:w-16 sm:h-16"
      width="64"
      height="64"
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
          hx-post="/tweets"
          hx-swap="outerHTML"
          hx-include="textarea"
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
  let authenticated = false;
  let currUser: any;
  const { request } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (session) {
    currUser = session.user;
    const username = user.username;
    authenticated = true;
  }
  // use self joins to get the reply message using replyTo (which is the id of the tweet it replies to)

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
    })
    .from(tweets)
    .orderBy(desc(tweets.createdAt))
    .innerJoin(user, eq(tweets.authorId, user.id))
    .leftJoin(replies, eq(tweets.replyTo, replies.id))
    .leftJoin(replyAuthor, eq(replies.authorId, replyAuthor.id));
  return (
    <div class="flex flex-col gap-6 flex-[2] py-6 h-min mx-8" id="tweets">
      <div class="flex justify-between items-center">
        <h1 class="text-text text-2xl pl-8 flex-1 font-bold block sm:hidden">
          Blabber
        </h1>
        {!authenticated && (
          <a
            href="/auth/signup"
            class="bg-primary p-4 px-8 text-xl hover:bg-primaryDark text-text rounded-full sm:hidden"
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
            ReplyMessage={tweet.replyMessage || undefined}
            ReplyUser={tweet.replyUser || undefined}
          />
        ))
      ) : (
        <p class="text-text">No tweets yet</p>
      )}
    </div>
  );
};

export const post = async (context: Context) => {
  const { request, body } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return "Unauthorized, please login again.";
  }
  const { content } = body as { content: string };
  if (!content) {
    return "Content is required";
  }
  const tweet: TweetInsert = {
    content: content,
    authorId: session.user.userId,
  };
  try {
    await db.insert(tweets).values(tweet);
    return new Response(await get(context), {
      headers: {
        "HX-Retarget": "#tweets",
      },
    });
  } catch (e) {
    console.log(e);
    return "Internal Server Error";
  }
};
