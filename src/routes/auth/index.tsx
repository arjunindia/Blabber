import BaseHtml from "../../BaseHTML";

// routes/index.ts
export async function get() {
  return (
    <BaseHtml>
      <body class="bg-secondary bg-opacity-100 text-text flex items-center bg-login">
        <div class="prose max-w-4xl mx-auto p-8 md:p-16 pb-8 rounded-2xl bg-secondary shadow-2xl hover:shadow-lg transition-all">
          <h1 class="text-text">
            Sign In To <code safe>{"< Blabber />"}</code> ✨
          </h1>
          <p class="text-text" id="login">
            Welcome to Blabber, the best place to share your thoughts with
            others. Sign in to get started!
          </p>
          <form class="mt-8">
            <div class="flex flex-col gap-4 ">
              <label class="text-text" for="email">
                Email
              </label>
              <input
                class="rounded-xl py-3 text-black"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                required="true"
              />
              <label class="text-text" for="password">
                Password
              </label>
              <input
                class="rounded-xl py-3 text-black"
                type="password"
                name="password"
                id="password"
                placeholder="**********"
                required="true"
              />
              <button
                class=" text-text w-full bg-primary p-4 rounded-xl mt-6 hover:bg-primaryDark"
                type="submit"
              >
                Sign In
              </button>
              <p class="text-text">
                Not a member?{" "}
                <a class="text-link" href="/auth/signup">
                  Sign up now!
                </a>
              </p>
            </div>
          </form>
        </div>
      </body>
    </BaseHtml>
  );
}
