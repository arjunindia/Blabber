import Elysia from "elysia";
import { login } from "./login";
import { signup } from "./signup";

export const authGroup = new Elysia().use(login).use(signup);
