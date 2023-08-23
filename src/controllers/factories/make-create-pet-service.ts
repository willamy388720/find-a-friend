import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { CreatePetService } from "@/services/pets/create-pet";

export function makeCreatePetService() {
  const prismaOrgsRepository = new PrismaOrgsRepository();
  const prismaPetsRepository = new PrismaPetsRepository();
  const service = new CreatePetService(
    prismaOrgsRepository,
    prismaPetsRepository
  );

  return service;
}
