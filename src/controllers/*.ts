import Elysia from "elysia";
import { interactionsController } from "./(interactions)/*";
import { authController } from "./auth";
import { tweetsController } from "./tweets";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(tweetsController)
  .use(interactionsController);
