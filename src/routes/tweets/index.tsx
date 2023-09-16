import type { Context } from "elysia";
import { auth } from "../auth/lucia";
import { db } from "../../db";
import { user } from "../../db/schema/userSchema";
import { tweets, TweetInsert, tweetLikes } from "../../db/schema/tweetSchema";
import { desc, eq, sql } from "drizzle-orm";
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
      />
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
type TweetProps = {
  id: string;
  name: string;
  username: string;
  content: string;
  createdAt: Date;
  verified: boolean;
  verificationMessage?: string;
};
const Tweet = ({
  id,
  name,
  username,
  content,
  createdAt,
  verified,
  verificationMessage,
}: TweetProps) => (
  <div class="flex flex-1 gap-6 w-full h-min p-3 sm:p-8 rounded-2xl bg-secondary bg-opacity-30">
    <img
      class="rounded-full w-8 h-8 sm:w-16 sm:h-16"
      width="64"
      height="64"
      src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`}
    />
    <div class="flex flex-col gap-2">
      <div class="flex flex-wrap flex-row gap-2 items-baseline">
        <p class="text-text font-bold" safe>
          {name}
        </p>
        {verified && (
          <div class="self-center">
            <div x-data={`{ tooltip: '${verificationMessage}' }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-text "
                x-tooltip="tooltip"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}

        <p class="text-text font-thin" safe>
          @{username}
        </p>
        <p class="text-text text-sm" safe>
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <p class="text-text" safe>
        {content}
      </p>
      <div class="flex flex-row gap-5 mt-4">
        <button
          class="text-text"
          hx-trigger="load"
          hx-get={`/tweets/like/${id}`}
          hx-swap="outerHTML"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-8 h-8 p-1 hover:text-pink-500 hover:bg-pink-500 hover:bg-opacity-40 rounded-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
        </button>
        <button class="text-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-8 h-8 p-1 hover:text-green-500 hover:bg-green-500 hover:bg-opacity-40 rounded-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
            />
          </svg>
        </button>
        <button class="text-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            class="w-8 h-8 p-1 hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-40 rounded-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export const get = async (context: Context) => {
  let authenticated = false;
  let currUser;
  const { request } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (session) {
    currUser = session.user;
    const username = user.username;
    authenticated = true;
  }
  // get all info as in TweetProps by joining tweets and users, also get like count
  const tweetList = await db
    .select({
      id: tweets.id,
      content: tweets.content,
      createdAt: tweets.createdAt,
      name: user.name,
      username: user.username,
      verified: user.verified,
      verificationMessage: user.verificationMessage,
      // likeCount: sql`COUNT(${tweetLikes.tweetId})`,
    })
    .from(tweets)
    .orderBy(desc(tweets.createdAt))
    .innerJoin(user, eq(tweets.authorId, user.id));
  // .leftJoin(tweetLikes, eq(tweets.id, tweetLikes.tweetId));
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
    content,
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
