import { InMemoryOrgsRepository } from "src/repositories/in-memory/in-memory-orgs-repository";
import { RegisterService } from "src/services/orgs/register";
import { compare } from "bcryptjs";
import { OrgAlreadyExistsError } from "src/errors/org-already-exists-error";

let inMemoryOrgsRepository: InMemoryOrgsRepository;
let sut: RegisterService;

describe("Register Service", () => {
  beforeEach(() => {
    inMemoryOrgsRepository = new InMemoryOrgsRepository();
    sut = new RegisterService(inMemoryOrgsRepository);
  });

  it("should be able to register org", async () => {
    const { org } = await sut.execute({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password: "123456",
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    expect(org.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { org } = await sut.execute({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password: "123456",
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      org.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "zedascabras@org.com";

    await sut.execute({
      name: "Organização Zé das Cabras",
      email,
      password: "123456",
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    await expect(() =>
      sut.execute({
        name: "Organização Zé das Cabras",
        email,
        password: "123456",
        address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
        cep: "60666-666",
        whatsapp: "(99) 99999-9999",
      })
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError);
  });
});
