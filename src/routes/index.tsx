import type { Context } from "elysia";
import BaseHtml from "../BaseHTML";
import { auth } from "./auth/lucia";
import { SideColumn, Sidebar } from "../components/Sidebar";

export const get = async (context: Context) => {
  const { request } = context;
  let authenticated: boolean = false;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    authenticated = true;
  }
  return (
    <BaseHtml>
      <body class="flex w-screen overflow-x-hidden min-h-screen justify-center bg-background">
        <Sidebar authenticated={authenticated} />
        <div
          hx-get="/tweets"
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
      </body>
    </BaseHtml>
  );
};
