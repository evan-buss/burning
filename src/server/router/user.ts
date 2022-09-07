import { getIronSession } from "iron-session";
import { z } from "zod";
import { sessionOptions } from "../../lib/withSession";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .query("findUser", {
    input: z.string(),
    async resolve({ input: uuid, ctx }) {
      return await ctx.prisma.user.findUnique({
        where: { uuid },
      });
    },
  })
  .mutation("signIn", {
    input: z.string(),
    async resolve({ input: uuid, ctx: { prisma, req, res } }) {
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

      const session = await getIronSession(req, res, sessionOptions);
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
    async resolve({ input, ctx }) {
      const { uuid, email, username } = input;

      const user = await ctx.prisma.user.create({
        data: {
          uuid,
          email,
          username,
        },
      });

      const session = await getIronSession(ctx.req, ctx.res, sessionOptions);
      session.user = {
        id: user.uuid,
      };
      await session.save();
    },
  });
