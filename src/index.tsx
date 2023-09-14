import { Elysia, t } from "elysia";
import { html, PropsWithChildren } from "@elysiajs/html";
import { TodoSelect, todos } from "./db/schema/todoSchema";
import { eq } from "drizzle-orm";
import { logger } from "@grotto/logysia";
import { autoroutes } from "elysia-autoroutes";
import { staticPlugin } from "@elysiajs/static";
import "@fontsource/noto-sans";

const app = new Elysia()
  .use(logger())
  .use(
    autoroutes({
      routesDir: "./routes",
    })
  )
  .use(staticPlugin())
  .use(html())
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

function TodoItem({ content, completed, id }: TodoSelect) {
  return (
    <div class="flex flex-row space-x-3">
      <p class="text-text">{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

function TodoList({ todos }: { todos: TodoSelect[] }) {
  return (
    <div class="flex-[2] py-6">
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
export type ElysiaApp = typeof app;
export type GetHandler = Parameters<typeof app.get>[1];
export type PostHandler = Parameters<typeof app.post>[1];
export type PutHandler = Parameters<typeof app.put>[1];
export type DelHandler = Parameters<typeof app.delete>[1];
