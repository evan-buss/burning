import superjson from "superjson";
import { createRouter } from "./context";
import { libraryRouter } from "./library";

import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("library.", libraryRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
