import { Pet, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { PetsRepository } from "../pets-repository";

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = [];

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id);

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
    const pets = this.items.filter(
      (item) =>
        item.city === city &&
        item.size.includes(size) &&
        item.energy_level.includes(energyLevel) &&
        item.level_of_independence.includes(levelOfIndependence)
    );

    return pets;
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      org_id: data.org_id,
      name: data.name,
      description: data.description,
      size: data.size,
      energy_level: data.energy_level,
      level_of_independence: data.level_of_independence,
      environment: data.environment,
      photo: data.photo,
      city: data.city ?? "Ocara",
    };

    this.items.push(pet);

    return pet;
  }
}
