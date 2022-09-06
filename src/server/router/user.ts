import { TRPCError } from "@trpc/server";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { sessionOptions } from "../../lib/withSession";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .query("findUser", {
    input: z.string().email(),
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findFirst({
        where: { plexEmail: input },
      });
      return user;
    },
  })
  .query("me", {
    async resolve({ ctx }) {
      return ctx.session.user;
    },
  })
  .mutation("createOrUpdate", {
    input: z.object({
      email: z.string().email().nullish(),
      username: z.string().nullish(),
      uuid: z.string().nullish(),
      libraries: z.array(
        z.object({
          uuid: z.string().uuid(),
          address: z.string().url(),
          key: z.string(),
        })
      ),
    }),
    async resolve({ input, ctx }) {
      if (!input.email || !input.username) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Both email and username are required.",
        });
      }

      const libraries = input.libraries.map((library) => ({
        create: {
          address: library.address,
          uuid: library.uuid,
          key: library.key,
        },
        update: {
          address: library.address,
          uuid: library.uuid,
          key: library.key,
        },
        where: {
          uuid: library.uuid,
        },
      }));

      const user = await ctx.prisma.user.upsert({
        create: {
          plexEmail: input.email,
          plexUsername: input.username,
          plexUUID: input.uuid ?? "",
          libraries: {
            create: input.libraries.map((library) => ({
              address: library.address,
              uuid: library.uuid,
              key: library.key,
            })),
          },
        },
        update: {
          plexEmail: input.email,
          plexUsername: input.username,
          libraries: {
            upsert: libraries,
          },
        },
        where: {
          plexEmail_plexUsername: {
            plexEmail: input.email,
            plexUsername: input.username,
          },
        },
        select: {
          id: true,
        },
      });

      const session = await getIronSession(ctx.req, ctx.res, sessionOptions);
      session.user = {
        id: user.id,
      };
      await session.save();
    },
  });
