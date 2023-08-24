import { app } from "@/app";
import { createAndAuthenticate } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

describe("Create Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a pet", async () => {
    const { token } = await createAndAuthenticate(app);

    const response = await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Branaldiz Jr.",
        description: "Eh um papalegua tetraplegico",
        size: "pequeno",
        energyLevel: "baixo",
        levelOfIndependence: "quase nada",
        environment: "aquatico",
      });

    expect(response.statusCode).toEqual(201);
  });
});
