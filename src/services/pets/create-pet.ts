import { Pet } from "@prisma/client";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";
import { OrgsRepository } from "src/repositories/orgs-repository";
import { PetsRepository } from "src/repositories/pets-repository";
import { findCityByCep } from "src/utils/service/find-city-by-cep";

interface CreatePetServiceRequest {
  orgId: string;
  name: string;
  description: string;
  size: string;
  energyLevel: string;
  levelOfIndependence: string;
  environment: string;
  photo: string;
}

interface CreatePetServiceResponse {
  pet: Pet;
}

export class CreatePetService {
  constructor(
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute({
    orgId,
    name,
    description,
    size,
    energyLevel,
    levelOfIndependence,
    environment,
    photo,
  }: CreatePetServiceRequest): Promise<CreatePetServiceResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const city = await findCityByCep(org.cep);

    const pet = await this.petsRepository.create({
      org_id: orgId,
      name,
      description,
      size,
      energy_level: energyLevel,
      level_of_independence: levelOfIndependence,
      environment,
      photo,
      city,
    });

    return { pet };
  }
}
