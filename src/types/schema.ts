import { z } from "zod";

export const CensusKeySchema = z.object({
  census_variable: z.string(),
  description: z.string(),
});

export const CensusDataSchema = z.object({
  id: z.number(),
  key: z.string(),
  data: z.number().nullable().optional(),
  census_id: z.string(),
});

export const CensusModelSchema = z.object({
  id: z.string(),
  year: z.number(),
  state: z.string(),
  FIPS: z.string(),
  data: z.array(CensusDataSchema),
  created_at: z.date(),
});

export type CensusKeySchema = z.infer<typeof CensusKeySchema>;
export type CensusDataSchema = z.infer<typeof CensusDataSchema>;
export type CensusModelSchema = z.infer<typeof CensusModelSchema>;
