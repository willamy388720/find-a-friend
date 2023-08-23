import { app } from "@/app";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { refresh } from "./refresh";

export async function orgRoutes() {
  app.post("/signup", register);
  app.post("/signin", authenticate);

  app.patch("/token/refresh", refresh);
}
