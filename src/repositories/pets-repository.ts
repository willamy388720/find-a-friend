import { Pet, Prisma } from "@prisma/client";

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>;
  findByFilters(
    city: string,
    size: string,
    energyLevel: string,
    levelOfIndependence: string
  ): Promise<Pet[]>;
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
}
