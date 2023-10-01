import Elysia from "elysia";
import { authGroup } from "./(auth)/*";
import { userGroup } from "./(user)/*";
import { explore } from "./explore";
import { index } from "./index";
import { tweet } from "./tweet";

export const pages = new Elysia()
  .use(index)
  .use(authGroup)
  .use(userGroup)
  .use(tweet)
  .use(explore);
