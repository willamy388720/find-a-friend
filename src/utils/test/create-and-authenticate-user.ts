import { prisma } from "@/libs/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticate(app: FastifyInstance) {
  const org = await prisma.org.create({
    data: {
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "62755-000",
      whatsapp: "(99) 99999-9999",
    },
  });

  const authResponse = await request(app.server).post("/signin").send({
    email: "zedascabras@org.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, org };
}
