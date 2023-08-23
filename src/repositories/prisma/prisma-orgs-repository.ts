import { Prisma } from "@prisma/client";
import { OrgsRepository } from "../orgs-repository";
import { prisma } from "@/libs/prisma";

export class PrismaOrgsRepository implements OrgsRepository {
  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id: id,
      },
    });

    if (!org) {
      return null;
    }

    return org;
  }

  async findOrgByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email: email,
      },
    });

    if (!org) {
      return null;
    }

    return org;
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = await prisma.org.create({ data });

    return org;
  }
}
