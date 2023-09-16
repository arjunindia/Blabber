import { Context } from "elysia";
import { tweetLikes } from "../../../db/schema/tweetSchema";
import { auth } from "../../auth/lucia";
import { db } from "../../../db";
import { eq, and, like } from "drizzle-orm";

const Button = ({ liked, id }: { liked: boolean; id: string }) => {
  if (liked) {
    return (
      <button
        class="text-text"
        hx-delete={`/tweets/like/${id}`}
        hx-swap="outerHTML"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
        </svg>
      </button>
    );
  } else {
    return (
      <button
        class="text-text"
        hx-post={`/tweets/like/${id}`}
        hx-swap="outerHTML"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          class="w-8 h-8 p-1 hover:text-pink-500 hover:bg-pink-500 hover:bg-opacity-40 rounded-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
          />
        </svg>
      </button>
    );
  }
};

export const get = async (context: Context) => {
  const { request, body, params } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return "Unauthorized, please login again.";
  }
  const { id } = params as { id: string };
  try {
    const liked = await db
      .select({
        tweetId: tweetLikes.tweetId,
      })
      .from(tweetLikes)
      .where(
        and(
          eq(tweetLikes.tweetId, id),
          eq(tweetLikes.userId, session.user.userId)
        )
      );
    if (liked.length > 0) {
      return <Button liked={true} id={id} />;
    }
    return <Button liked={false} id={id} />;
  } catch (e) {
    console.log(e);
    return <Button liked={false} id={id} />;
  }
};

export const post = async (context: Context) => {
  const { request, body, params } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return "Unauthorized, please login again.";
  }
  const { id } = params as { id: string };

  try {
    await db.insert(tweetLikes).values({
      tweetId: id,
      userId: session.user.userId,
    });
    return <Button liked={true} id={id} />;
  } catch (e) {
    console.log(e);
    return <Button liked={false} id={id} />;
  }
};
export const del = async (context: Context) => {
  const { request, body, params } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  const { id } = params as { id: string };
  try {
    await db
      .delete(tweetLikes)
      .where(
        and(
          eq(tweetLikes.tweetId, id),
          eq(tweetLikes.userId, session.user.userId)
        )
      );
    return <Button liked={false} id={id} />;
  } catch (e) {
    console.log(e);
    return <Button liked={true} id={id} />;
  }
};
