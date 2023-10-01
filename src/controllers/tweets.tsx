import { and, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { Elysia, t } from "elysia";
import { EditTweet, Tweet } from "../components/tweets";
import { config } from "../config";
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
  })
  .post(
    "/",
    async ({ session, body, db, set }) => {
      if (!session) {
        return "Unauthorized, please login again.";
      }
      const { content, images } = body;
      if (!content) {
        return "Content is required";
      }
      if (content.length > 300) {
        return "Content is too long";
      }
      if (images && images.length > 4) {
        return "You can only upload up to 4 images";
      }
      const imgCDN = "https://api.imgbb.com/1/upload";
      const imgCDNKey = config.env.IMG_CDN_KEY;
      const imgJson: any[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("key", imgCDNKey);
          const res = await fetch(imgCDN, {
            method: "POST",
            body: formData,
          });
          const { data } = await res.json();
          imgJson.push(data);
        }
      }
      if (images && !Array.isArray(images)) {
        const formData = new FormData();
        formData.append("image", images);
        formData.append("key", imgCDNKey);
        const res = await fetch(imgCDN, {
          method: "POST",
          body: formData,
        });
        const { data } = await res.json();
        imgJson.push(data);
      }
      const imgUrls = imgJson.map((url) => {
        return {
          url: url.url,
          deleteUrl: url.delete_url,
          width: url.width,
          height: url.height,
        };
      });
      console.log(imgJson);

      const tweet = await db.insert(tweets).values({
        content,
        authorId: session.user.id,
        image: imgUrls.length > 0 ? JSON.stringify(imgJson) : null,
      });
      set.headers["HX-Refresh"] = "true";
      console.log(tweet);
      return tweet;
    },
    {
      body: t.Object({
        content: t.String({
          minLength: 1,
          maxLength: 300,
        }),

        images: t.Optional(
          t.Files({
            maxFiles: 4,
            maxSize: 1024 * 1024 * 5,
            minSize: 0,
            mimeTypes: ["image/jpeg", "image/png", "image/gif"],
            minItems: 0,
            default: [],
            type: ["image/jpeg", "image/png", "image/gif"],
            maxItems: 4,
          }),
        ),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ params, session, db, set }) => {
      if (!session) {
        return "Unauthorized, please login again.";
      }
      const tweet = await db
        .delete(tweets)
        .where(
          and(eq(tweets.id, params.id), eq(tweets.authorId, session.user.id)),
        )
        .execute();
      set.headers["HX-Refresh"] = "true";
      return tweet;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
