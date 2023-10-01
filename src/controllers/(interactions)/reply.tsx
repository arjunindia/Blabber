import { and, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { LuciaError } from "lucia";
import { ReplyModal } from "../../components/interactions/Reply";
import { config } from "../../config";
import { ctx } from "../../context";
import { tweets } from "../../db/schema/tweets";

export const replyController = new Elysia({
  prefix: "/reply",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get(
    "/:replyId",
    async ({ params: { replyId }, session, db }) => {
      if (!session) {
        throw new LuciaError("REQUEST_UNAUTHORIZED");
      }
      return <ReplyModal tweetId={replyId} currUser={session.user} />;
    },
    { params: t.Object({ replyId: t.String() }) },
  )
  .post(
    "/:replyId",
    async ({ params: { replyId }, session, db, body, set }) => {
      const { content, images } = body;
      if (!session) {
        throw new LuciaError("REQUEST_UNAUTHORIZED");
      }
      if (!content) {
        return <p class="text-red-500">Content cannot be empty</p>;
      }
      if (content.length > 300) {
        return <p class="text-red-500">Content cannot be longer than 300</p>;
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
        replyTo: replyId,
      });
      set.headers["HX-Refresh"] = "true";
      console.log(tweet);
      return tweet;
    },
    {
      params: t.Object({ replyId: t.String() }),
      body: t.Object({
        content: t.String(),
        images: t.Optional(
          t.Files({
            maxItems: 4,
            maxSize: 5 * 1024 * 1024,
            types: ["image/png", "image/jpeg", "image/gif"],
          }),
        ),
      }),
      error({ code, error, set, log }) {
        log.error(error);

        let errorMessage = "";

        if (code === "VALIDATION") {
          errorMessage =
            "Your input has an invalid format! 🤔 Check your input!";
        } else if (error instanceof LuciaError) {
          if (error.message === "REQUEST_UNAUTHORIZED") {
            errorMessage = "You are not logged in!";
          } else {
            errorMessage = "Error: " + error.message;
          }
        } else {
          errorMessage = "Error: " + code;
        }

        set.status = "Unauthorized"; // set the status to 400 for all errors for simplicity

        return (
          <div class="text-sm text-red-500" id="errorMessage">
            {errorMessage}
          </div>
        );
      },
    },
  );
