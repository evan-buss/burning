import { z } from "zod";
import { createProtectedRouter } from "./context";

export const libraryRouter = createProtectedRouter()
  .query("get", {
    async resolve({ ctx: { prisma, session } }) {
      const data = await prisma.user.findUniqueOrThrow({
        where: {
          uuid: session.user.id,
        },
        include: {
          libraries: true,
        },
      });

      return data?.libraries;
    },
  })
  .mutation("upsertServers", {
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
  })
  .mutation("toggle", {
    input: z.object({
      uuid: z.string().uuid(),
      key: z.string(),
      server: z.string(),
    }),
    async resolve({ input, ctx: { prisma, session } }) {
      return await prisma.$transaction(async (prismaT) => {
        const library = await prismaT.library.findFirst({
          where: {
            uuid: input.uuid,
            userUUID: session.user.id,
            serverUUID: input.server,
          },
        });

        if (library) {
          await prismaT.library.delete({
            where: {
              uuid_userUUID: {
                userUUID: session.user.id,
                uuid: input.uuid,
              },
            },
          });
        } else {
          await prismaT.library.create({
            data: {
              uuid: input.uuid,
              userUUID: session.user.id,
              serverUUID: input.server,
              key: input.key,
            },
          });
        }
      });
    },
  });
