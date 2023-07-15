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

export const RadarDataSchema = z
  .object({
    key: z.string(),
  })
  .catchall(z.number().nullable());

export const LineDataSchema = z.object({
  id: z.string(),
  data: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
    })
  ),
});

export const BarDataSchema = z
  .object({
    state: z.string(),
  })
  .catchall(z.string());

export const BumpDataSchema = z.object({
  id: z.string(),
  data: z.array(z.object({ x: z.number(), y: z.number().nullable() })),
});

export type CensusKeySchema = z.infer<typeof CensusKeySchema>;
export type CensusDataSchema = z.infer<typeof CensusDataSchema>;
export type CensusModelSchema = z.infer<typeof CensusModelSchema>;
export type RadarDataSchema = z.infer<typeof RadarDataSchema>;
export type LineDataSchema = z.infer<typeof LineDataSchema>;
export type BarDataSchema = z.infer<typeof BarDataSchema>;
export type BumpDataSchema = z.infer<typeof BumpDataSchema>;
