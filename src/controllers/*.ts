import Elysia from "elysia";
import { interactionsController } from "./(interactions)/*";
import { userController } from "./(user)/*";
import { authController } from "./auth";
import { tweetsController } from "./tweets";

export const api = new Elysia({
  prefix: "/api",
})
  .use(authController)
  .use(tweetsController)
  .use(interactionsController)
  .use(userController);
