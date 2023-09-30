type FormContent = {
  email?: string;
  username?: string;
  name?: string;
  password?: string;
};
export function SignUpForm({
  content = { email: "" },
  errors,
  success = false,
}: {
  content?: Omit<FormContent, "password">;
  errors?: FormContent;
  success?: boolean;
}) {
  return (
    <form
      hx-ext="response-targets"
      class="mt-8"
      hx-post="/api/auth/signUp"
      hx-swap="outerHTML"
      hx-indicator=".loading"
      hx-push-url="true"
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
        <label class="text-text" for="username">
          Username (unique)
        </label>
        <input
          class="rounded-xl p-3 text-black"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          required="true"
          hx-validate
          value={content.username}
        />
        <div class="text-sm text-red-500">{errors?.username}</div>
        <label class="text-text" for="name">
          Display Name
        </label>
        <input
          class="rounded-xl p-3 text-black"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          required="true"
          hx-validate
          value={content.name}
        />
        <div class="text-sm text-red-500">{errors?.name}</div>
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
          class=" text-text bg-primary hover:bg-primaryDark flex w-fit gap-4 rounded-xl px-6 py-4"
          type="submit"
        >
          Sign In
          <div class="loading htmx-indicator i-eos-icons-loading h-6 w-6" />
        </button>
        <p class="text-text">
          Already a member?{" "}
          <a class="text-link" href="/login">
            Login here {"->"}
          </a>
        </p>
      </div>
      {success && (
        <div class="text-text">
          <p class="text-text">
            You have successfully signed up! Please check your email to verify
            your account.
          </p>
        </div>
      )}
    </form>
  );
}
