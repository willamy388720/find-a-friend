import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { randomUUID } from "crypto";

import { makeCreatePetService } from "../factories/make-create-pet-service";

import { ResourceNotFoundError } from "@/errors/resource-not-found-error";

import {
  generateSignedUrl,
  uploadFile,
} from "@/utils/controllers/firebase-storage";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    description: z.string(),
    size: z.string(),
    energyLevel: z.string(),
    levelOfIndependence: z.string(),
    environment: z.string(),
  });

  const {
    name,
    description,
    size,
    energyLevel,
    levelOfIndependence,
    environment,
  } = registerSchema.parse(request.body);

  let photo: string;

  try {
    if (!request.file) {
      photo = "";
    } else {
      const file = request.file;
      const originalName = file.originalname.split(".")[0];
      const fileType = file.originalname.split(".")[1];

      const fileName = `${originalName}_${randomUUID()}.${fileType}`;

      await uploadFile(file, fileName);

      photo = await generateSignedUrl(fileName);
    }

    const createPetService = makeCreatePetService();

    await createPetService.execute({
      orgId: request.user.sub,
      name,
      description,
      size,
      energyLevel,
      levelOfIndependence,
      environment,
      photo,
    });

    return reply.status(201).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
