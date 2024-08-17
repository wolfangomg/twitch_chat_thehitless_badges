import { z } from "zod";

export const UserValidator = z.object({
  token: z.string(),
  userId: z.object({
    badge: z.string(),
    name: z.string()
  })
});

export type User = z.infer<typeof UserValidator>;
