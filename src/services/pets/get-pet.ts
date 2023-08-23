import { Pet } from "@prisma/client";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";
import { OrgsRepository } from "src/repositories/orgs-repository";
import { PetsRepository } from "src/repositories/pets-repository";
import { findCityByCep } from "src/utils/service/find-city-by-cep";

interface GetPetServiceRequest {
  id: string;
}

interface GetPetServiceResponse {
  pet: Pet;
}

export class GetPetService {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ id }: GetPetServiceRequest): Promise<GetPetServiceResponse> {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    return { pet };
  }
}
