import { Context } from "elysia";
import { auth } from "./lucia";

export async function GET(context: Context) {
  const { request } = context;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  await auth.invalidateSession(session.sessionId);
  const sessionCookie = auth.createSessionCookie(null);
  return new Response(null, {
    headers: {
      Location: "/auth/login", // redirect to login page
      "Set-Cookie": sessionCookie.serialize(), // delete session cookie
    },
    status: 302,
  });
}
