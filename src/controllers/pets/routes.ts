import { app, upload } from "@/app";
import { verifyJWT } from "@/middlewares/verify-jwt";
import { create } from "./create";

export async function petRoutes() {
  app.post(
    "/pets",
    { onRequest: [verifyJWT], preHandler: upload.single("file") },
    create
  );
}
