import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .query("findUser", {
    input: z.string().nullish(),
    async resolve({ input: uuid, ctx }) {
      if (!uuid) {
        return {};
      }

      return await ctx.prisma.user.findUnique({
        where: { uuid },
      });
    },
  })
  .mutation("signIn", {
    input: z.string(),
    async resolve({ input: uuid, ctx: { session, req, res } }) {
      // const user = await prisma.user.update({
      //   where: {
      //     uuid,
      //   },
      //   data: {
      //     signedIn: new Date(),
      //   },
      // });

      // TODO: This prob isn't secure as anyone could pass the user's UUID.
      // How can we tie the OAuth signin to a user value.
      session.user = {
        id: uuid,
      };
      await session.save();
    },
  })
  .mutation("signUp", {
    input: z.object({
      uuid: z.string(),
      email: z.string().email(),
      username: z.string(),
    }),
    async resolve({ input, ctx: { prisma, session } }) {
      const { uuid, email, username } = input;

      const user = await prisma.user.create({
        data: {
          uuid,
          email,
          username,
        },
      });

      session.user = {
        id: user.uuid,
      };
      await session.save();
    },
  })
  .mutation("signOut", {
    async resolve({ ctx: { session } }) {
      session.destroy();
    },
  });
