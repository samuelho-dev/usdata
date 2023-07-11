import { z } from "zod";

const CensusKey = z.object({
  census_variable: z.string(),
  description: z.string(),
});

const CensusData = z.object({
  id: z.number(),
  census_key: CensusKey,
  key: z.string(),
  data: z.number().optional(),
  census_id: z.string(),
});

const CensusModel = z.object({
  id: z.string(),
  year: z.number(),
  state: z.string(),
  FIPS: z.string(),
  data: z.array(CensusData),
  created_at: z.date(),
});

export type CensusKey = z.infer<typeof CensusKey>;
export type CensusData = z.infer<typeof CensusData>;
export type CensusModel = z.infer<typeof CensusModel>;
