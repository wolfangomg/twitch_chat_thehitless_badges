import { z } from "zod";

export const THBadgesGroupValidator = z.object({
  _id: z.string(),
  name: z.string(),
  url: z.string(),
  description: z.string()
});

export const GetTHBadgesResponseValidator = z.record(
  z.string(),
  THBadgesGroupValidator,
);

export type BadgesGroup = z.infer<typeof THBadgesGroupValidator>;

export type GetTHBadgesResponse = z.infer<typeof GetTHBadgesResponseValidator>;
