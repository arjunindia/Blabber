import Elysia from "elysia";
import { likeController } from "./like";
import { replyController } from "./reply";

export const interactionsController = new Elysia()
  .use(likeController)
  .use(replyController);
