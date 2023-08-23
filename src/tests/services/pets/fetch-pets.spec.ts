import { InMemoryOrgsRepository } from "src/repositories/in-memory/in-memory-orgs-repository";
import { hash } from "bcryptjs";
import { InMemoryPetsRepository } from "src/repositories/in-memory/in-memory-pets-repository";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";
import { FetchPetService } from "@/services/pets/fetch-pets";

let inMemoryOrgsRepository: InMemoryOrgsRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let sut: FetchPetService;

describe("Fetch Pets Service", () => {
  beforeEach(() => {
    inMemoryOrgsRepository = new InMemoryOrgsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    sut = new FetchPetService(inMemoryPetsRepository);
  });

  it("should be able to fetch pets", async () => {
    const org = await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "62755-000",
      whatsapp: "(99) 99999-9999",
    });

    for (let i = 0; i < 20; i++) {
      await inMemoryPetsRepository.create({
        org_id: org.id,
        name: `Branaldiz Jr. ${i}`,
        description: "Eh um papalegua tetraplegico",
        size: i === 1 || i === 2 || i === 3 ? "pequeno" : "giga",
        energy_level: i === 1 || i === 2 || i === 3 ? "baixo" : "grande",
        level_of_independence:
          i === 1 || i === 2 || i === 3 ? "quase nada" : "muito",
        environment: "aquatico",
        photo: "asdjkashjkdhaskjhdjkhasjk",
        city: "Fortaleza",
      });
    }

    const { pets } = await sut.execute({
      city: "Fortaleza",
      size: "pequeno",
      energyLevel: "baixo",
      levelOfIndependence: "quase nada",
    });

    expect(pets).toHaveLength(3);
    expect(pets).toEqual([
      expect.objectContaining({ name: "Branaldiz Jr. 1" }),
      expect.objectContaining({ name: "Branaldiz Jr. 2" }),
      expect.objectContaining({ name: "Branaldiz Jr. 3" }),
    ]);
  });

  it("should be able to fetch pets by city", async () => {
    const org = await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "62755-000",
      whatsapp: "(99) 99999-9999",
    });

    for (let i = 0; i < 20; i++) {
      await inMemoryPetsRepository.create({
        org_id: org.id,
        name: `Branaldiz Jr. ${i}`,
        description: "Eh um papalegua tetraplegico",
        size: i === 1 || i === 2 || i === 3 ? "pequeno" : "giga",
        energy_level: i === 1 || i === 2 || i === 3 ? "baixo" : "grande",
        level_of_independence:
          i === 1 || i === 2 || i === 3 ? "quase nada" : "muito",
        environment: "aquatico",
        photo: "asdjkashjkdhaskjhdjkhasjk",
        city: i === 1 ? "Fortaleza" : "Ocara",
      });
    }

    const { pets } = await sut.execute({
      city: "Fortaleza",
    });

    expect(pets).toHaveLength(1);
  });
});
