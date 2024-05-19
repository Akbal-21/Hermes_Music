import { PrismaClient } from "@prisma/client";
declare global {
	var prisma: PrismaClient | undefined;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export const prisma = global.prisma || new PrismaClient();

if (process.env.NOVE !== "production") {
	global.prisma = prisma;
}

export const connection = prisma.$connect();
export const disconnect = prisma.$disconnect();
