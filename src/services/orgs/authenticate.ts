import { Org } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "src/errors/invalid-credentials-error";
import { OrgsRepository } from "src/repositories/orgs-repository";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  org: Org;
}

export class AuthenticateService {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const org = await this.orgsRepository.findOrgByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, org.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { org };
  }
}
