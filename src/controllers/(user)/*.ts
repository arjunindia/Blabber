import Elysia from "elysia";
import { editController } from "./edit";

export const userController = new Elysia().use(editController);
