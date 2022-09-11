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
          libraries: {
            include: {
              server: true,
            },
          },
        },
      });

      return data?.libraries;
    },
  })
  .mutation("toggle", {
    input: z.object({
      uuid: z.string().uuid(),
      key: z.string(),
      server: z.string(),
      mode: z.enum(["on", "off"]),
    }),
    async resolve({ input, ctx: { prisma, session } }) {
      if (input.mode === "off") {
        await prisma.library.delete({
          where: {
            uuid_userUUID: {
              userUUID: session.user.id,
              uuid: input.uuid,
            },
          },
        });
      } else {
        await prisma.library.create({
          data: {
            uuid: input.uuid,
            userUUID: session.user.id,
            serverUUID: input.server,
            key: input.key,
          },
        });
      }
    },
  });
