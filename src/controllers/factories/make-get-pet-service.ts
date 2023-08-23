import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { GetPetService } from "@/services/pets/get-pet";

export function makeGetPetService() {
  const prismaPetsRepository = new PrismaPetsRepository();
  const service = new GetPetService(prismaPetsRepository);

  return service;
}
