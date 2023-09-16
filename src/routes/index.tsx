import type { Context } from "elysia";
import BaseHtml from "../BaseHTML";
import { auth } from "./auth/lucia";

const SidebarLink = ({
  icon,
  content,
  href,
}: {
  icon: string;
  content: string;
  href: string;
}) => (
  <a
    href={href}
    class="p-4 px-4 sm:px-8 text-xl text-text flex gap-3 items-center"
  >
    {icon}
    <span class="text-text text-xl font-bold invisible sm:visible">
      {content}
    </span>
  </a>
);
const Sidebar = ({ authenticated }: { authenticated: boolean }) => (
  <aside class="flex-[0.3] pt-16 sm:flex-1 sm:pt-6 sm:pl-8 h-full w-full">
    <div class="flex flex-col justify-between h-full fixed">
      <h1 class="text-text text-2xl pl-8 flex-1 font-bold hidden sm:block">
        Blabber
      </h1>

      <div class="flex flex-col gap-6 flex-1">
        <SidebarLink
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          }
          content="Home"
          href="/"
        />
        <SidebarLink
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
          content="Explore"
          href="/explore"
        />
        <SidebarLink
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          }
          content="Search"
          href="/search"
        />
        {!authenticated ? (
          <a
            href="/auth/signup"
            class="bg-primary p-4 px-8 text-xl hover:bg-primaryDark text-text rounded-full hidden sm:block"
          >
            Signup
          </a>
        ) : (
          <a
            href="/"
            class="bg-primary p-4 px-8 mx-auto text-xl hover:bg-primaryDark text-text rounded-full text-center hidden sm:block"
          >
            Post
          </a>
        )}
      </div>
      <div class="flex-1 mt-5">
        {authenticated && (
          <SidebarLink
            content="Sign Out"
            href="/auth/signout"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                />
              </svg>
            }
          />
        )}
      </div>
    </div>
  </aside>
);
const SideColumn = () => (
  <aside class="flex-1 p-6 hidden xl:block">
    <div class="flex flex-col gap-6 fixed">
      {/* search */}
      <input
        class="rounded-xl py-3 text-black w-full"
        type="text"
        name="search"
        id="search"
        placeholder="Search"
        required="true"
        hx-validate="true"
      />
    </div>
  </aside>
);

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
