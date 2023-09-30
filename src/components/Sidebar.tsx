const SidebarLink = ({
  icon,
  content,
  href,
}: {
  icon: JSX.Element;
  content: string;
  href: string;
}) => (
  <a
    href={href}
    class="text-text hover:bg-primaryDark flex h-min items-center rounded-lg p-4 text-xl sm:gap-3 sm:px-8"
  >
    {icon}
    <span class="text-text hidden text-xl font-bold sm:block">{content}</span>
  </a>
);
export const Sidebar = ({ authenticated }: { authenticated: boolean }) => (
  <aside class="h-full w-full flex-[0] pt-16 sm:flex-1 sm:pl-8 sm:pt-6">
    <div class="fixed flex h-full flex-col justify-between">
      <div class=" hidden flex-1 gap-2 pl-8 font-bold sm:flex">
        <img src="/public/icon.jpg" alt="logo" class="h-8 w-8" />
        <h1 class="text-text text-2xl ">Blabber</h1>
      </div>

      <div class="bg-primary absolute bottom-0 z-50 flex h-24 w-screen -translate-y-1/2 flex-row items-center justify-evenly gap-6 sm:static sm:inset-0 sm:w-auto sm:flex-1 sm:flex-col sm:bg-transparent">
        <SidebarLink
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              class="h-6 w-6"
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
              class="h-6 w-6"
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
              class="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          }
          content="Search"
          href="/search?q=hello"
        />
        {!authenticated ? (
          <a
            href="/auth/signup"
            class="bg-primary hover:bg-primaryDark text-text hidden rounded-full p-4 px-8 text-xl sm:block"
          >
            Signup
          </a>
        ) : (
          <a
            href="/"
            class="bg-primary hover:bg-primaryDark text-text mx-auto hidden rounded-full p-4 px-8 text-center text-xl sm:block"
          >
            Post
          </a>
        )}
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
                className="h-6 w-6"
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
export const SideColumn = () => (
  <aside class="hidden flex-1 p-6 xl:block">
    <div class="fixed flex flex-col gap-6">
      {/* search */}
      <input
        class="w-full rounded-xl p-3 text-black"
        type="text"
        name="search"
        id="search"
        placeholder="Search"
        required="true"
        hx-validate
      />
    </div>
  </aside>
);
