import { OAuthRequestError } from "@lucia-auth/oauth";
import Elysia from "elysia";
import { parseCookie, serializeCookie } from "lucia/utils";
import { LoginForm } from "../../components/auth/LoginForm";
import { BaseHtml } from "../../components/base";
import { config } from "../../config";
import { ctx } from "../../context";

export const login = new Elysia().use(ctx).get("/login", async (ctx) => {
  const authRequest = ctx.auth.handleRequest(ctx);
  const session = await authRequest.validate();
  if (session) {
    ctx.set.redirect = "/";
    return;
  }

  return ctx.html(() => (
    <BaseHtml
      className="bg-secondary text-text bg-login flex min-h-screen items-center bg-opacity-100"
      title="Login"
    >
      <div class="prose bg-secondary mx-auto max-w-4xl rounded-2xl p-8 pb-8 shadow-2xl transition-all hover:shadow-lg md:p-16">
        <h1 class="text-text">
          Log In To <code safe>{"< Blabber />"}</code> ✨
        </h1>
        <p class="text-text" id="login">
          Welcome back to Blabber, the best place to share your thoughts with
          others!
        </p>
        <LoginForm />
      </div>
    </BaseHtml>
  ));
});
