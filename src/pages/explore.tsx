import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { BaseHtml } from "../components/base";
import { ctx } from "../context";
import { user } from "../db/schema";

export const explore = new Elysia()
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();
    if (!session) {
      return new Response("Unauthorized", {
        headers: {
          "HX-Redirect": "/login",
        },
      });
    }
    return { session };
  })
  .get("/explore", async ({ htmlStream, db }) => {
    const verifiedUsers = await db
      .select({
        userId: user.id,
        username: user.username,
        displayName: user.name,
        avatar: user.avatar,
        message: user.verificationMessage,
      })
      .from(user)
      .where(eq(user.verified, true));
    return htmlStream(() => (
      <BaseHtml className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden">
        <div class="text-text bg-secondary m-12 w-full max-w-7xl rounded-2xl p-8">
          <h1 class=" text-text text-4xl font-bold">Explore</h1>
          <h2 class="text-text mt-8 text-xl font-thin">Our Verified Users</h2>
          <div class="mt-8 grid grid-cols-1 flex-wrap gap-4 md:grid-cols-3">
            {verifiedUsers.map((user) => (
              <a href={`/user/${user.username}`}>
                <div class="bg-primary flex h-full flex-col items-center justify-start gap-3 rounded-xl bg-opacity-25 p-4 shadow-xl transition-all hover:shadow-sm">
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`
                    }
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <p class="text-text font-bold">{user.displayName}</p>
                  <p class="text-text font-thin">@{user.username}</p>
                  <blockquote class="text-text px-6 font-thin italic">
                    "{user.message}"
                  </blockquote>
                </div>
              </a>
            ))}
          </div>
        </div>
      </BaseHtml>
    ));
  });
