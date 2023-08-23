import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRegisterService } from "../factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    cep: z.string(),
    address: z.string(),
    whatsapp: z.string(),
  });

  const { name, email, password, cep, address, whatsapp } =
    registerSchema.parse(request.body);

  const registerService = makeRegisterService();

  await registerService.execute({
    name,
    email,
    password,
    cep,
    address,
    whatsapp,
  });

  return reply.status(201).send();
}
