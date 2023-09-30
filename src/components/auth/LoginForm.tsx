export const LoginForm = ({
  content = { email: "" },
  errors,
  success = false,
}: {
  content?: { email: string };
  errors?: { email?: string; password?: string };
  success?: boolean;
}) => {
  return (
    <form
      hx-ext="response-targets"
      class="mt-8"
      hx-post="/api/auth/signIn"
      hx-swap="outerHTML"
      hx-indicator=".loading"
      hx-trigger="submit"
      hx-target-4xx="#errorMessage"
    >
      <div class="flex flex-col gap-4 ">
        <label class="text-text" for="email">
          Email
        </label>
        <input
          class="rounded-xl p-3 text-black"
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required="true"
          hx-validate
          value={content.email}
        />
        <div class="text-sm text-red-500">{errors?.email}</div>
        <label class="text-text" for="password">
          Password
        </label>
        <input
          class="rounded-xl p-3 text-black"
          type="password"
          name="password"
          id="password"
          placeholder="**********"
          required="true"
          minlength="6"
          min="6"
          hx-validate
        />
        <div class="text-sm text-red-500" id="errorMessage">
          {errors?.password}
        </div>
        <button
          class=" text-text bg-primary hover:bg-primaryDark mt-6 flex w-fit gap-4 rounded-xl px-6 py-4 "
          type="submit"
        >
          Sign In
          <div class="loading htmx-indicator i-eos-icons-loading h-6 w-6" />
        </button>

        <p class="text-text">
          Not a member?{" "}
          <a class="text-link" href="/auth/signup">
            Sign up now!
          </a>
        </p>
      </div>
    </form>
  );
};
