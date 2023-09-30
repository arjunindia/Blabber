import Elysia from "elysia";
import { likeController } from "./like";

export const interactionsController = new Elysia().use(likeController);
