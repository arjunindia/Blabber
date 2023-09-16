import { LuciaError } from "lucia";
import BaseHtml from "../../BaseHTML";
import { auth } from "./lucia";
import { Context } from "elysia";
import { LibsqlError } from "@libsql/client";

type FormContent = {
  email?: string;
  username?: string;
  name?: string;
  password?: string;
};
function Form({
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
      class="mt-8"
      hx-post="/auth/signup"
      hx-swap="outerHTML"
      hx-indicator=".loading"
      hx-push-url="true"
      hx-trigger="submit"
    >
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
        <label class="text-text" for="username">
          Username (unique)
        </label>
        <input
          class="rounded-xl py-3 text-black"
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          required="true"
          hx-validate="true"
          value={content.username}
        />
        <div class="text-red-500 text-sm">{errors?.username}</div>
        <label class="text-text" for="name">
          Display Name
        </label>
        <input
          class="rounded-xl py-3 text-black"
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          required="true"
          hx-validate="true"
          value={content.name}
        />
        <div class="text-red-500 text-sm">{errors?.name}</div>
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
          class=" text-text bg-primary px-6 py-4 gap-4 rounded-xl hover:bg-primaryDark flex w-fit"
          type="submit"
        >
          Sign In
          <span class="loading htmx-indicator animate-spin w-fit">
            <svg
              class="w-6 h-6 text-text"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        </button>
        <p class="text-text">
          Already a member?{" "}
          <a class="text-link" href="/auth/login">
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
// routes/index.ts
export async function get() {
  return (
    <BaseHtml>
      <body class="bg-secondary bg-opacity-100 text-text flex items-center h-full bg-signup min-h-screen">
        <div class="prose max-w-4xl mx-auto p-8 md:p-8 pb-8 rounded-2xl bg-secondary shadow-2xl hover:shadow-lg transition-all ">
          <h1 class="text-text">Sign Up for a new Blabber Account✨</h1>
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

export async function post({ body }: Context) {
  const { email, username, name, password } = body as {
    email: string;
    username: string;
    name: string;
    password: string;
  };
  if (!email) {
    return <Form errors={{ email: "Email is required" }} content={{ email }} />;
  }
  if (!password) {
    return (
      <Form content={{ email }} errors={{ password: "Password is required" }} />
    );
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
  if (!username) {
    return (
      <Form content={{ email }} errors={{ username: "Username is required" }} />
    );
  }
  try {
    const user = await auth.createUser({
      key: {
        providerId: "email", // auth method
        providerUserId: email.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        email: email.toLowerCase(),
        username,
        name,
        createdAt: new Date(),
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);

    let headers = new Headers();
    headers.append("Content-Type", "text/html");
    headers.append("HX-Redirect", "/");
    headers.append("Set-Cookie", sessionCookie.serialize());
    return new Response(<Form success />, { headers });
  } catch (e) {
    if (e instanceof LuciaError && e.message === "AUTH_DUPLICATE_KEY_ID") {
      // user already exists
      return (
        <Form
          errors={{ email: "Email already exists" }}
          content={{ username, email, name }}
        />
      );
    } else if (e instanceof LuciaError && e.message === "AUTH_INVALID_KEY_ID") {
      return (
        <Form
          errors={{ email: "Invalid email" }}
          content={{ username, email, name }}
        />
      );
    } else if (e instanceof LibsqlError && e.code === "SQLITE_CONSTRAINT") {
      return (
        <Form
          content={{ username, email, name }}
          errors={
            e.message.includes("username")
              ? { username: "Username already exists!" }
              : {
                  email:
                    "Your email already exists. Try <a href='/auth/login/' class='text-link'>Logging in.</a>",
                }
          }
        />
      );
    }

    return (
      <Form
        errors={{ password: "Server Error Occured!" }}
        content={{ username, email, name }}
      />
    );
  }
}