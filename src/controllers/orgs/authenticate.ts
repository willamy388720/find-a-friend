import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateService } from "../factories/make-authenticate-service";
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = registerSchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateService();

    const { org } = await authenticateService.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sub: org.id,
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      { sub: org.id, expiresIn: "7d" }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(201)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
