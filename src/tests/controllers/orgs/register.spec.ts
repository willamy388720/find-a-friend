import { app } from "@/app";
import request from "supertest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/signup").send({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password: "123456",
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    expect(response.statusCode).toEqual(201);
  });
});
