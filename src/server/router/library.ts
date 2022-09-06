import { createRouter } from "./context";

export const libraryRouter = createRouter().query("selected", {
  async resolve({ ctx }) {
    const userId = ctx.session.user?.id;

    const libraries = await ctx.prisma.libraries.findMany({
      where: {
        user: {
          every: {
            id: userId,
          },
        },
      },
    });

    return {
      libraries,
    };
  },
});
