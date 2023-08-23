import { app } from "@/app";
import { register } from "./register";
import { authenticate } from "./authenticate";

export async function orgRoutes() {
  app.post("/signup", register);
  app.post("/signin", authenticate);
}
