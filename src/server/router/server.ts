import { z } from "zod";
import { createProtectedRouter } from "./context";

export const serverRouter = createProtectedRouter().mutation("upsert", {
  input: z.array(
    z.object({
      uuid: z.string(),
      name: z.string(),
      address: z.string().url(),
    })
  ),
  async resolve({
    input: servers,
    ctx: {
      prisma,
      session: { user },
    },
  }) {
    await prisma.$transaction(
      servers.map(({ uuid, name, address }) =>
        prisma.server.upsert({
          create: {
            uuid,
            name,
            address,
          },
          update: {
            uuid,
            name,
            address,
            users: {
              connect: [{ uuid: user.id }],
            },
          },
          where: {
            uuid,
          },
        })
      )
    );
  },
});
