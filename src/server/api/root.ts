import { fetchRouter } from "~/server/api/routers/fetch";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  fetch: fetchRouter,
});

export type AppRouter = typeof appRouter;
