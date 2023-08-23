import { InMemoryOrgsRepository } from "src/repositories/in-memory/in-memory-orgs-repository";
import { hash } from "bcryptjs";
import { AuthenticateService } from "src/services/orgs/authenticate";
import { InvalidCredentialsError } from "src/errors/invalid-credentials-error";

let inMemoryOrgsRepository: InMemoryOrgsRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    inMemoryOrgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateService(inMemoryOrgsRepository);
  });

  it("should be able to authenticate org", async () => {
    await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    const { org } = await sut.execute({
      email: "zedascabras@org.com",
      password: "123456",
    });

    expect(org).toEqual(
      expect.objectContaining({ name: "Organização Zé das Cabras" })
    );
  });

  it("should be able to authenticate with wrong password", async () => {
    await inMemoryOrgsRepository.create({
      name: "Organização Zé das Cabras",
      email: "zedascabras@org.com",
      password_hash: await hash("123456", 6),
      address: "Rua Onde Judas perdeu as botas, 666, Parque dos Dinossauros",
      cep: "60666-666",
      whatsapp: "(99) 99999-9999",
    });

    await expect(() =>
      sut.execute({
        email: "zedascabras@org.com",
        password: "123457",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "zedascabras@org.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
