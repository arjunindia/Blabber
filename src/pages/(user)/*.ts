import Elysia from "elysia";
import { editPage } from "./edit";
import { userPage } from "./user";

export const userGroup = new Elysia({
  prefix: "/user",
})
  .use(userPage)
  .use(editPage);
