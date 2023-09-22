import { Context } from "elysia";
import { auth } from "../../auth/lucia";
import { ReplyModal } from "../../../components/Modal";
import { TweetInsert, tweets } from "../../../db/schema/tweetSchema";
import { db } from "../../../db";
import { get as getTweets } from "../index";
import { createId } from "@paralleldrive/cuid2";
import { env } from "bun";

export const get = async (context: Context) => {
  const { request, params } = context;
  let authenticated: boolean = false;
  let currUser: any;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    authenticated = true;
    currUser = session.user;
    authenticated = true;
  }
  const { id } = params as { id: string };
  const Reply = await ReplyModal({ tweetId: id, currUser });

  return Reply;
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
  const { id } = context.params as { id: string };
  if (!content) {
    return "Content is required";
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
    content,
    image: imgCDNLinks ? JSON.stringify(imgCDNLinks) : undefined,
    authorId: session.user.userId,
    replyTo: id,
  };
  try {
    await db.insert(tweets).values(tweet);
    return new Response("Reply Added!", {
      headers: {
        "HX-Redirect": "/tweet/" + id,
      },
    });
  } catch (e) {
    console.log(e);
    return "Internal Server Error";
  }
};
