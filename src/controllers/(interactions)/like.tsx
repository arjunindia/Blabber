import { and, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { LuciaError } from "lucia";
import { LikeButton } from "../../components/interactions/LikeButton";
import { ctx } from "../../context";
import { tweetLikes } from "../../db/schema/tweets";

export const likeController = new Elysia({
  prefix: "/like",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get(
    "/:tweetId",
    async ({ params: { tweetId }, session, db }) => {
      if (!session) {
        return new Response("Unauthorized", {
          headers: {
            "HX-Redirect": "/login",
          },
        });
      }
      let count = 0;
      try {
        const likeCount = await db
          .select({
            count: sql<number>`COUNT(*)`,
          })
          .from(tweetLikes)
          .where(eq(tweetLikes.tweetId, tweetId))
          .limit(1);
        count = likeCount[0]?.count || 0;
      } catch (e) {
        console.log(e);
        count = 0;
      }
      if (!session) {
        return <LikeButton liked={false} id={tweetId} count={count} />;
      }
      try {
        const liked = await db
          .select({
            tweetId: tweetLikes.tweetId,
          })
          .from(tweetLikes)
          .where(
            and(
              eq(tweetLikes.tweetId, tweetId),
              eq(tweetLikes.userId, session.user.userId),
            ),
          );

        if (liked.length > 0) {
          return <LikeButton liked={true} id={tweetId} count={count} />;
        }
        return <LikeButton liked={false} id={tweetId} count={count} />;
      } catch (e) {
        console.log(e);
        return <LikeButton liked={false} id={tweetId} count={count} />;
      }
    },
    { params: t.Object({ tweetId: t.String() }) },
  )
  .post(
    "/:tweetId",
    async ({ params: { tweetId }, session, db }) => {
      if (!session) {
        return new Response("Unauthorized", {
          headers: {
            "HX-Redirect": "/login",
          },
        });
      }
      try {
        await db.insert(tweetLikes).values({
          tweetId,
          userId: session.user.userId,
        });
        return <LikeButton liked={true} id={tweetId} count={0} />;
      } catch (e) {
        console.log(e);
        return <LikeButton liked={false} id={tweetId} count={0} />;
      }
    },
    { params: t.Object({ tweetId: t.String() }) },
  )
  .delete("/:tweetId", async ({ params: { tweetId }, session, db }) => {
    if (!session) {
      return new Response("Unauthorized", {
        headers: {
          "HX-Redirect": "/login",
        },
      });
    }
    try {
      await db
        .delete(tweetLikes)
        .where(
          and(
            eq(tweetLikes.tweetId, tweetId),
            eq(tweetLikes.userId, session.user.userId),
          ),
        );
      return <LikeButton liked={false} id={tweetId} count={0} />;
    } catch (e) {
      console.log(e);
      return <LikeButton liked={false} id={tweetId} count={0} />;
    }
  });
