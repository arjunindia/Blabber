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
  .post(
    "/signUp",
    async ({ body: { email, username, name, password }, auth, set }) => {
      let user = await auth.createUser({
        key: {
          providerId: "email", // auth method
          providerUserId: email.toLowerCase(), // unique id when using "username" auth method
          password, // hashed by Lucia
        },
        attributes: {
          email: email.toLowerCase(),
          username,
          name,
          createdAt: new Date(),
        },
      });

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
        username: t.String({
          minLength: 3,
          maxLength: 255,
        }),
        name: t.String({
          minLength: 1,
          maxLength: 255,
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
          errorMessage =
            "Your input has an invalid format! 🤔 Check your input!";
        } else if (error instanceof LuciaError) {
          if (error.message === "AUTH_DUPLICATE_KEY_ID") {
            errorMessage = "Email already in use";
          } else if (error.message === "AUTH_INVALID_PASSWORD") {
            errorMessage = "Invalid password";
          } else {
            errorMessage = "Error: " + code;
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
