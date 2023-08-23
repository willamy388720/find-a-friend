import { InMemoryOrgsRepository } from "src/repositories/in-memory/in-memory-orgs-repository";
import { compare, hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "src/errors/org-already-exists-error";
import { InMemoryPetsRepository } from "src/repositories/in-memory/in-memory-pets-repository";
import { CreatePetService } from "src/services/pets/create-pet";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";
import { GetPetService } from "src/services/pets/get-pet";

let inMemoryOrgsRepository: InMemoryOrgsRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let sut: GetPetService;

describe("Get Pet Service", () => {
  beforeEach(() => {
    inMemoryOrgsRepository = new InMemoryOrgsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    sut = new GetPetService(inMemoryPetsRepository);
  });

  it("should be able to get pet", async () => {
    const org = await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "62755-000",
      whatsapp: "(99) 99999-9999",
    });

    const pet = await inMemoryPetsRepository.create({
      org_id: org.id,
      name: "Branaldiz Jr.",
      description: "Eh um papalegua tetraplegico",
      size: "pequeno",
      energy_level: "baixo",
      level_of_independence: "quase nada",
      environment: "aquatico",
      photo: "asdjkashjkdhaskjhdjkhasjk",
      city: "Fortaleza",
    });

    sut.execute({
      id: pet.id,
    });

    expect(pet).toEqual(expect.objectContaining({ city: "Fortaleza" }));
  });

  it("should not be able create pet with wrong id", async () => {
    await expect(() =>
      sut.execute({
        id: "1",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
