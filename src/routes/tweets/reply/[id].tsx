import { Context } from "elysia";
import { auth } from "../../auth/lucia";
import { ReplyModal } from "../../../components/Modal";
import { TweetInsert, tweets } from "../../../db/schema/tweetSchema";
import { db } from "../../../db";

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
  const { content } = body as { content: string };
  const { id } = context.params as { id: string };
  if (!content) {
    return "Content is required";
  }
  const tweet: TweetInsert = {
    content,
    authorId: session.user.userId,
    replyTo: id,
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
