import { app } from "@/app";
import { prisma } from "@/libs/prisma";
import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to refresh a token", async () => {
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

    const authResponse = await request(app.server).post("/signin").send({
      email: "zedascabras@org.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
