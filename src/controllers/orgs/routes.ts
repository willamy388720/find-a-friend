import { app } from "@/app";
import { register } from "./register";

export async function orgRoutes() {
  app.post("/signup", register);
}
