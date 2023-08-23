import { Org } from "@prisma/client";
import { hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "src/errors/org-already-exists-error";
import { OrgsRepository } from "src/repositories/orgs-repository";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
  cep: string;
  address: string;
  whatsapp: string;
}

interface RegisterServiceResponse {
  org: Org;
}

export class RegisterService {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    cep,
    address,
    whatsapp,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const password_hash = await hash(password, 6);

    const orgWithSameEmail = await this.orgsRepository.findOrgByEmail(email);

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError();
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash,
      cep,
      address,
      whatsapp,
    });

    return { org };
  }
}
