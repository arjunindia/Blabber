import { Elysia, t } from "elysia";
import { html, PropsWithChildren } from "@elysiajs/html";
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

export type ElysiaApp = typeof app;
export type GetHandler = Parameters<typeof app.get>[1];
export type PostHandler = Parameters<typeof app.post>[1];
export type PutHandler = Parameters<typeof app.put>[1];
export type DelHandler = Parameters<typeof app.delete>[1];
