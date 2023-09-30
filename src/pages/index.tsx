import { Suspense } from "beth-stack/jsx";
import { Elysia } from "elysia";
import { authed } from "../auth/middleware";
import { BaseHtml } from "../components/base";
import { Sidebar, SideColumn } from "../components/Sidebar";
import { Tweet } from "../components/tweets";
import { ctx } from "../context";

export const index = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get("/", async ({ htmlStream, session, db }) => {
    return htmlStream(() => (
      <BaseHtml className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden">
        <Sidebar authenticated={session ? true : false} />
        <div
          hx-get="/api/tweets"
          hx-swap="outerHTML"
          hx-trigger="load"
          class="flex-[2] py-6"
        >
          <div role="status" class="cp-paragraph h-56">
            <span class="sr-only">Loading...</span>
          </div>
          <div role="status" class="cp-paragraph h-56">
            <span class="sr-only">Loading...</span>
          </div>
          <div role="status" class="cp-paragraph h-56">
            <span class="sr-only">Loading...</span>
          </div>
          <div role="status" class="cp-paragraph h-56">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <SideColumn />
      </BaseHtml>
    ));
  });
