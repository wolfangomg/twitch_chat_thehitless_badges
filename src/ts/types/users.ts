import { z } from "zod";

export const UserValidator = z.object({
  userId: z.object({
    badge: z.string(),
    name: z.string()
  })
});

export type User = z.infer<typeof UserValidator>;
