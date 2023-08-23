import { InMemoryOrgsRepository } from "src/repositories/in-memory/in-memory-orgs-repository";
import { RegisterService } from "src/services/orgs/register";
import { compare, hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "src/errors/org-already-exists-error";
import { InMemoryPetsRepository } from "src/repositories/in-memory/in-memory-pets-repository";
import { CreatePetService } from "src/services/pets/create-pet";
import exp from "constants";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";

let inMemoryOrgsRepository: InMemoryOrgsRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let sut: CreatePetService;

describe("Create Pet Service", () => {
  beforeEach(() => {
    inMemoryOrgsRepository = new InMemoryOrgsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    sut = new CreatePetService(inMemoryOrgsRepository, inMemoryPetsRepository);
  });

  it("should be able to create pet", async () => {
    const org = await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "62755-000",
      whatsapp: "(99) 99999-9999",
    });

    const { pet } = await sut.execute({
      orgId: org.id,
      name: "Branaldiz Jr.",
      description: "Eh um papalegua tetraplegico",
      size: "pequeno",
      energyLevel: "baixo",
      levelOfIndependence: "quase nada",
      environment: "aquatico",
      photo: "asdjkashjkdhaskjhdjkhasjk",
    });

    expect(pet.id).toEqual(expect.any(String));
    expect(pet).toEqual(expect.objectContaining({ city: "Ocara" }));
  });

  it("should not be able create pet with wrong org", async () => {
    await expect(() =>
      sut.execute({
        orgId: "1",
        name: "Branaldiz Jr.",
        description: "Eh um papalegua tetraplegico",
        size: "pequeno",
        energyLevel: "baixo",
        levelOfIndependence: "quase nada",
        environment: "aquatico",
        photo: "asdjkashjkdhaskjhdjkhasjk",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
