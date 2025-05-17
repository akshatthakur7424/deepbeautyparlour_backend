import { PrismaClient } from "./generated/prisma";

// export * from "@prisma/client";

export const db = new PrismaClient();