import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import multer from "fastify-multer";
import { ZodError } from "zod";

import { env } from "./env";
import { orgRoutes } from "./controllers/orgs/routes";
import { petRoutes } from "./controllers/pets/routes";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "50m",
  },
});

app.register(fastifyCookie);
app.register(multer.contentParser);

app.register(orgRoutes);
app.register(petRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal error server." });
});
