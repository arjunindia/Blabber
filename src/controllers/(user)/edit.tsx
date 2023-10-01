import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { LuciaError } from "lucia";
import { ctx } from "../../context";
import { user } from "../../db/schema/auth";

export const editController = new Elysia({
  prefix: "/user",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .post(
    "/edit/:userId",
    async ({
      body: { name, bio, location, website },
      auth,
      set,
      params: { userId },
      db,
      session,
    }) => {
      if (!session) {
        throw new LuciaError("REQUEST_UNAUTHORIZED");
      }
      const userDetails = (
        await db
          .select({
            username: user.username,
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            website: user.website,
            verified: user.verified,
            verificationMessage: user.verificationMessage,
          })
          .from(user)
          .where(eq(user.id, userId))
      )[0];

      if (!userDetails) {
        throw new Error("User not found");
      }

      if (session?.user?.id !== userDetails.id) {
        throw new LuciaError("REQUEST_UNAUTHORIZED");
      }

      await db
        .update(user)
        .set({
          name: name || userDetails.name,
          bio: bio || userDetails.bio,
          location: location || userDetails.location,
          website: website || userDetails.website,
        })
        .where(eq(user.id, userId));

      set.headers["HX-Location"] = "/user/" + userDetails.username;
    },
    {
      body: t.Object({
        name: t.Optional(
          t.String({
            minLength: 1,
            maxLength: 50,
          }),
        ),
        bio: t.Optional(
          t.String({
            maxLength: 160,
          }),
        ),

        location: t.Optional(
          t.String({
            maxLength: 30,
          }),
        ),

        website: t.Optional(
          t.String({
            maxLength: 50,
          }),
        ),
      }),
      error({ code, error, set, log }) {
        log.error(error);

        let errorMessage = "";

        if (code === "VALIDATION") {
          errorMessage = "Invalid input";
        } else {
          errorMessage = "Error: " + code + " " + error.message;
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
