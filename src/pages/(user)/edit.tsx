import { Suspense } from "beth-stack/jsx";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { Elysia, t } from "elysia";
import { authed } from "../../auth/middleware";
import { BaseHtml } from "../../components/base";
import { EditForm } from "../../components/Profile/EditProfileForm";
import { Profile } from "../../components/Profile/Profile";
import { Sidebar, SideColumn } from "../../components/Sidebar";
import { EditTweet, Tweet } from "../../components/tweets";
import { ctx } from "../../context";
import { user } from "../../db/schema/auth";
import { tweets } from "../../db/schema/tweets";

export const editPage = new Elysia({
  prefix: "/edit",
})
  .use(ctx)
  .derive(async (ctx) => {
    const authRequest = ctx.auth.handleRequest(ctx);
    const session = await authRequest.validate();

    return { session };
  })
  .get(
    "/:userId",
    async ({ htmlStream, params: { userId }, session, db }) => {
      const authenticated = !!session;
      if (!authenticated) {
        return htmlStream(() => (
          <BaseHtml>
            <Sidebar authenticated={authenticated} />
            <div class="flex flex-1 flex-col items-center justify-center">
              <h1 class="text-4xl font-bold">Error</h1>
              <p class="text-gray-500">
                You must be logged in to view this page.
              </p>
            </div>
            <SideColumn />
          </BaseHtml>
        ));
      }
      const siteUser = (
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
          .where(eq(user.id, session?.user?.id))
      )[0];

      if (!siteUser) {
        return htmlStream(() => (
          <BaseHtml>
            <Sidebar authenticated={authenticated} />
            <div class="flex flex-1 flex-col items-center justify-center">
              <h1 class="text-4xl font-bold">User not found</h1>
              <p class="text-gray-500">
                The user you are looking for does not exist.
              </p>
            </div>
            <SideColumn />
          </BaseHtml>
        ));
      }

      return htmlStream(() => (
        <BaseHtml
          className="bg-background flex min-h-screen w-screen justify-center overflow-x-hidden"
          title="Edit User"
        >
          <Sidebar authenticated={authenticated} />
          <EditForm {...siteUser} />
          <SideColumn />
        </BaseHtml>
      ));
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
    },
  );
