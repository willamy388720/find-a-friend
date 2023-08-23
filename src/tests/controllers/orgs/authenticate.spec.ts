import { app } from "@/app";
import { prisma } from "@/libs/prisma";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await prisma.org.create({
      data: {
        name: "Organização Zé das Cabras",
        email: "zedascabras@org.com",
        password_hash: await hash("123456", 6),
        address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
        cep: "62755-000",
        whatsapp: "(99) 99999-9999",
      },
    });

    const response = await request(app.server).post("/signin").send({
      email: "zedascabras@org.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.token).toEqual(expect.any(String));
  });
});
