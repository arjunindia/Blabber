import type { Context } from "elysia";
import { auth } from "../auth/lucia";
import { db } from "../../db";
import { user } from "../../db/schema/userSchema";
import { tweets, TweetInsert, tweetLikes } from "../../db/schema/tweetSchema";
import { desc, eq, sql } from "drizzle-orm";
import { Tweet } from "../../components/Tweet";
import { alias } from "drizzle-orm/sqlite-core";
import { FileUpload } from "../../components/FileUpload";
import { createId } from "@paralleldrive/cuid2";

import { env } from "bun";
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
      <div class="flex flex-row gap-5 mt-4 justify-between items-end">
        <FileUpload fileIdString="files" prevIdString="image-preview" />
        <button
          class="text-text px-6 py-3 bg-primary rounded-full"
          hx-post="/tweets"
          hx-swap="innerHTML"
          hx-include="textarea, input[type=file]"
          hx-encoding="multipart/form-data"
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
      replyId: replies.id,
      images: tweets.image,
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
            ReplyId={tweet.replyId || undefined}
            images={
              tweet.images ? (JSON.parse(tweet.images) as [any]) : undefined
            }
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

  const { content, images } = body as {
    content: string;
    images?: File | File[];
  };
  if (!content) {
    return "Content is required";
  }

  if (content.length > 300) {
    return "Content must be less than 300 characters";
  }

  // upload images to imgBB

  const imgCDN = "https://api.imgbb.com/1/upload";
  const imgCDNKey = env.IMG_CDN_KEY;

  if (!imgCDNKey) {
    return "Internal Server Error";
  }
  let imgCDNJson;
  let imgCDNLinks;
  if (images && !Array.isArray(images)) {
    try {
      const formData = new FormData();
      formData.append("image", images);
      formData.append("key", imgCDNKey);
      formData.append("name", createId());
      const imgCDNResponse = await fetch(imgCDN, {
        method: "POST",
        body: formData,
      });
      imgCDNJson = await imgCDNResponse.json();
      imgCDNLinks = [
        {
          url: imgCDNJson.data.url,
          deleteUrl: imgCDNJson.data.delete_url,
          width: imgCDNJson.data.width,
          height: imgCDNJson.data.height,
        },
      ];
    } catch (e) {
      console.log(e);
      console.log(imgCDNJson);
      return "Internal Server Error";
    }
  } else if (images && images.length > 0) {
    if (images?.length > 4) {
      return "Only 4 images allowed";
    }

    try {
      const imgCDNResponse = await Promise.all(
        images?.map((image) => {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("key", imgCDNKey);
          formData.append("name", createId());
          return fetch(imgCDN, {
            method: "POST",
            body: formData,
          });
        }) || []
      );
      imgCDNJson = await Promise.all(imgCDNResponse.map((res) => res.json()));
      imgCDNLinks = imgCDNJson.map((json) => {
        return {
          url: json.data.url,
          deleteUrl: json.data.delete_url,
          width: json.data.width,
          height: json.data.height,
        };
      });
      console.log(imgCDNJson, imgCDNLinks);
    } catch (e) {
      console.log(e);
      console.log(imgCDNJson);
      return "Internal Server Error";
    }
  }
  const tweet: TweetInsert = {
    content: content,
    authorId: session.user.userId,
    image: images ? JSON.stringify(imgCDNLinks) : undefined,
  };
  try {
    await db.insert(tweets).values(tweet);
    return new Response(await get(context), {
      headers: {
        "HX-Retarget": "#tweets",
        "HX-Reswap": "outerHTML",
      },
    });
  } catch (e) {
    console.log(e);
    return "Internal Server Error";
  }
};
