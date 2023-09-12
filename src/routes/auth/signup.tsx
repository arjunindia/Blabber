import BaseHtml from "../../BaseHTML";

function Form({
  content = { email: "" },
  errors,
  success = false,
}: {
  content?: { email: string };
  errors?: { email?: string; password?: string };
  success?: boolean;
}) {
  return (
    <form class="mt-8" hx-post="/auth" hx-swap="outerHTML">
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
          required="true"
          hx-validate="true"
          value={content.email}
        />
        <div class="text-red-500 text-sm">{errors?.email}</div>
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
          minlength="6"
          min="6"
          hx-validate="true"
        />
        <div class="text-red-500 text-sm">{errors?.password}</div>
        <button
          class=" text-text w-full bg-primary p-4 rounded-xl mt-6 hover:bg-primaryDark"
          type="submit"
        >
          Sign In
        </button>
        <p class="text-text">
          Already a member?{" "}
          <a class="text-link" href="/auth/signin">
            Sign In now!
          </a>
        </p>
      </div>
    </form>
  );
}
// routes/index.ts
export async function get() {
  return (
    <BaseHtml>
      <body class="bg-secondary bg-opacity-100 text-text flex items-center bg-signup">
        <div class="prose max-w-4xl mx-auto p-8 md:p-16 pb-8 rounded-2xl bg-secondary shadow-2xl hover:shadow-lg transition-all">
          <h1 class="text-text">
            Sign Up for a new <code safe>{"< Blabber />"}</code> Account✨
          </h1>
          <p class="text-text" id="login">
            Welcome to Blabber, the best place to share your thoughts with
            others. Sign in to get started!
          </p>
          <Form />
        </div>
      </body>
    </BaseHtml>
  );
}

export async function post({
  body,
}: {
  body: { email: string; password: string };
}) {
  const { email, password } = body;
  if (!email || !password) {
    return <Form errors={{ email: "Email is required" }} content={{ email }} />;
  }
  //regexp for email validation
  const emailRegexp = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
  if (!emailRegexp.test(email)) {
    return <Form content={{ email }} errors={{ email: "Email is invalid" }} />;
  }
  if (password.length < 6) {
    return (
      <Form
        content={{ email }}
        errors={{ password: "Password is too short" }}
      />
    );
  }
  return <Form success />;
}
