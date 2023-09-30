import { Elysia, t } from "elysia";
import { LuciaError } from "lucia";
import { ctx } from "../context";

class DuplicateEmailError extends Error {
  constructor() {
    super("Duplicate email");
  }
}

export const authController = new Elysia({
  prefix: "/auth",
})
  .use(ctx)
  .post(
    "/signIn",
    async ({ body: { email, password }, auth, set }) => {
      let user = await auth.useKey("email", email.toLowerCase(), password);

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.createSessionCookie(session);

      set.headers["Set-Cookie"] = sessionCookie.serialize();
      set.headers["HX-Location"] = "/";
    },
    {
      body: t.Object({
        email: t.String({
          minLength: 5,
          maxLength: 255,
          format: "email",
          default: "",
        }),
        password: t.String({
          minLength: 4,
          maxLength: 255,
        }),
      }),
      error({ code, error, set, log }) {
        log.error(error);

        let errorMessage = "";

        if (code === "VALIDATION") {
          errorMessage = "The email or password has an invalid format! 🤔";
        } else if (
          error instanceof LuciaError &&
          (error.message === "AUTH_INVALID_KEY_ID" ||
            error.message === "AUTH_INVALID_PASSWORD")
        ) {
          errorMessage = "Invalid email or password";
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
  )
  .post("/signout", async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    if (!session) {
      ctx.set.status = "Unauthorized";
      return "You are not logged in";
    }

    await ctx.auth.invalidateSession(session.sessionId);

    const sessionCookie = ctx.auth.createSessionCookie(null);

    ctx.set.headers["Set-Cookie"] = sessionCookie.serialize();
    ctx.set.headers["HX-Location"] = "/";
  });
