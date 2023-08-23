import { Pet } from "@prisma/client";
import { ResourceNotFoundError } from "src/errors/resource-not-found-error";
import { PetsRepository } from "src/repositories/pets-repository";

interface FetchPetServiceRequest {
  city: string;
  size?: string | null;
  energyLevel?: string | null;
  levelOfIndependence?: string | null;
}

interface FetchPetServiceResponse {
  pets: Pet[];
}

export class FetchPetService {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    size,
    energyLevel,
    levelOfIndependence,
  }: FetchPetServiceRequest): Promise<FetchPetServiceResponse> {
    const sizeFilter = size ?? "";
    const energyLevelFilter = energyLevel ?? "";
    const levelOfIndependenceFilter = levelOfIndependence ?? "";

    const pets = await this.petsRepository.findByFilters(
      city,
      sizeFilter,
      energyLevelFilter,
      levelOfIndependenceFilter
    );

    return { pets };
  }
}
