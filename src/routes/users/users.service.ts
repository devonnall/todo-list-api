import { prisma } from "../../db/prisma";

export const createUser = async (email: string, name: string) => {
    return await prisma.user.create({ data: { email, name }});
};