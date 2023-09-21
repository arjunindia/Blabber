import { and, eq } from "drizzle-orm";
import { Context } from "elysia";
import { get } from "../tweets/index";
import { db } from "../../db";
import { tweets } from "../../db/schema/tweetSchema";
import { auth } from "../auth/lucia";

export const del = async (context: Context) => {
  const { request, params } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return "Unauthorized, please login again.";
  }
  const { id } = params as { id: string };
  try {
    await db
      .delete(tweets)
      .where(and(eq(tweets.id, id), eq(tweets.authorId, session.user.userId)));
    return new Response(await get(context), {
      headers: {
        "HX-Retarget": "#tweets",
        "HX-Reswap": "outerHTML",
        "HX-Trigger": "tweetDelete",
      },
    });
  } catch (e) {
    console.log(e);
    return "Something went wrong, please try again later.";
  }
};
