import type { Todo } from "../db/schema/todos";

export function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p safe>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/api/todos/toggle/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      />
      <button
        class="text-red-500"
        hx-delete={`/api/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div safe>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

export function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/api/todos"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <select name="content" class="border border-black">
        <option value="" disabled="true" selected="true">
          Select a Todo
        </option>
        <option value="beth">Learn the BETH stack</option>
        <option value="vim">Learn vim</option>
        <option value="like">Like the video</option>
        <option value="sub">Subscribe to Ethan</option>
      </select>
      <button type="submit">Add</button>
    </form>
  );
}