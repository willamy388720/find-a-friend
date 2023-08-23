import { Prisma } from "@prisma/client";
import { PetsRepository } from "../pets-repository";
import { prisma } from "@/libs/prisma";

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id: id,
      },
    });

    if (!pet) {
      return null;
    }

    return pet;
  }

  async findByFilters(
    city: string,
    size: string,
    energyLevel: string,
    levelOfIndependence: string
  ) {
    const pets = await prisma.pet.findMany({
      where: {
        AND: {
          city: city,
          size: {
            contains: size,
          },
          energy_level: {
            contains: energyLevel,
          },
          level_of_independence: {
            contains: levelOfIndependence,
          },
        },
      },
    });

    return pets;
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({ data });

    return pet;
  }
}
