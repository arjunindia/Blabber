import type { Context } from "elysia";
import BaseHtml from "../BaseHTML";

const Sidebar = () => (
  <aside class="flex-1 p-6 pr-16 h-full w-full">
    <div class="flex flex-col justify-between h-full fixed w-1/6">
      <h1 class="text-text text-2xl pl-8 flex-1 font-bold">Blabber</h1>
      <div class="flex flex-col gap-6 flex-1">
        <a href="/" class=" p-4 px-8 text-xl text-text">
          Home
        </a>
        <a href="/search" class=" p-4 px-8 text-xl text-text">
          Search
        </a>
        <a
          href="/auth/signup"
          class="bg-primary p-4 px-8 text-xl hover:bg-primaryDark text-text rounded-full"
        >
          Signup
        </a>
      </div>
      <div class="flex-1"></div>
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
  return (
    <BaseHtml>
      <body class="flex w-full h-screen justify-center bg-background">
        <Sidebar />
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
