import { Context } from "elysia";
import { auth } from "../auth/lucia";
import BaseHtml from "../../BaseHTML";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user } from "../../db/schema/userSchema";

export const get = async (context: Context) => {
  const { request } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return new Response("Unauthorized", {
      headers: {
        "HX-Redirect": "/auth/login",
      },
    });
  }
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
  return (
    <BaseHtml>
      <body class="flex w-screen overflow-x-hidden min-h-screen justify-center bg-background">
        <div className="m-12 text-text max-w-7xl bg-secondary w-full p-8 rounded-2xl">
          <h1 className=" font-bold text-text text-4xl">Explore</h1>
          <h2 class="text-text font-thin mt-8 text-xl">Our Verified Users</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4 mt-8">
            {verifiedUsers.map((user) => (
              <a href={`/users/${user.username}`}>
                <div class="flex flex-col items-center justify-start bg-primary bg-opacity-25 rounded-xl shadow-xl hover:shadow-sm transition-all p-4 gap-3 h-full">
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user.username}`
                    }
                    class="rounded-full h-16 w-16 object-cover"
                  />
                  <p class="text-text font-bold">{user.displayName}</p>
                  <p class="text-text font-thin">@{user.username}</p>
                  <quote class="text-text font-thin px-6 italic">
                    "{user.message}"
                  </quote>
                </div>
              </a>
            ))}
          </div>
        </div>
      </body>
    </BaseHtml>
  );
};
