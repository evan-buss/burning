import { z } from "zod";
import { createProtectedRouter } from "./context";

export const libraryRouter = createProtectedRouter()
  .query("get", {
    input: z.string(),
    async resolve({ input: server, ctx }) {
      const userId = ctx.session.user.id;

      const data = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          libraries: true,
        },
      });

      return data?.libraries;
    },
  })
  .mutation("update", {
    input: z.array(
      z.object({
        uuid: z.string().uuid(),
        address: z.string().url(),
        key: z.string(),
      })
    ),
    async resolve({ input, ctx }) {
      const userId = ctx.session.user.id;

      // Remove all user references to specific libraries
      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          libraries: {
            set: [],
          },
        },
        include: {
          libraries: true,
        },
      });

      // Add references to the selected libraries.
      await ctx.prisma.$transaction(
        input.map((library) =>
          ctx.prisma.libraries.upsert({
            create: {
              address: library.address,
              uuid: library.uuid,
              key: library.key,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
            update: {
              address: library.address,
              uuid: library.uuid,
              key: library.key,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
            where: {
              uuid: library.uuid,
            },
          })
        )
      );

      // await ctx.prisma.user.deleteMany({

      // })

      console.log(`updated ${input.length} records for ${userId}`);
    },
  });
