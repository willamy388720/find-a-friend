import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { FetchPetService } from "@/services/pets/fetch-pets";

export function makeFetchPetsService() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const service = new FetchPetService(prismaPetsRepository);

  return service;
}
