import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LineDataSchema } from "~/types/schema";

export const fetchRouter = createTRPCRouter({
  fetchStates: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.censusModel.findMany({
      select: {
        id: true,
        year: true,
        state: true,
        FIPS: true,
      },
      distinct: ["FIPS"],
    });

    return data;
  }),
  fetchDatasetsByYear: publicProcedure
    .input(z.object({ year: z.number(), ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.censusModel.findMany({
        where: {
          year: input.year,
          FIPS: {
            in: input.ids,
          },
        },
        select: {
          id: true,
        },
      });

      // console.log({ data }, "Models by year");

      return data;
    }),
  fetchRadarData: publicProcedure
    .input(z.array(z.object({ id: z.string() })))

    .mutation(async ({ ctx, input }) => {
      type Check = {
        [key: string]: string;
      };

      const check: Check = {
        B19301_001E: `Per Capita Income in the Past 12 Months (in inflation-adjusted dollars)`,
        B25003_002E: `Owner Occupied Housing Units`,
        B23025_005E: `Unemployment Rate`,
        B15003_022E: `Bachelor's Degree or Higher`,
      };

      const data = await ctx.prisma.censusData.findMany({
        where: {
          census_id: {
            in: input.map((el) => el.id),
          },
          key: {
            in: Object.keys(check),
          },
        },
        select: {
          id: true,
          key: true,
          data: true,
          census_model: {
            select: {
              id: true,
              state: true,
              FIPS: true,
            },
          },
        },
      });

      // console.log({ data, length: data.length }, "RADAR DATA");
      // const dataDemo = {
      //   Data: [
      //     { id: 169, key: "B15003_022E", data: null, census_model: [Object] },
      //     { id: 182, key: "B23025_005E", data: null, census_model: [Object] },
      //   ],
      //   length: 12,
      // };

      // [{key: B19301_001E,
      // state_name: data,
      // state_name: data,
      // state_name: data,}]

      type StateData = { [state: string]: number | null };
      type DataObject = { key: string; max: number } & StateData;

      const obj: { [key: string]: DataObject } = {};
      for (const item of data) {
        // First item is key
        if (!obj[item.key]) {
          obj[item.key] = { key: check[item.key], max: 0 } as DataObject;
        }

        // Take the state as the key, data value
        const value = Number(item.data) / 100;
        (obj[item.key] as StateData)[item.census_model.state] = value;

        // Update max value if current value is larger
        if (value > obj[item.key].max) {
          obj[item.key].max = value;
        }
      }

      const result = Object.values(obj);

      // Since the data range is pretty wide
      // Normalizing allows the data to be visualized easier

      const normalizedResult = result.map((el) => {
        const normalizedEl: { key: string; max: number; [key: string]: any } = {
          key: el.key,
          max: el.max,
        };
        for (const key in el) {
          if (key !== "key" && key !== "max" && el[key] !== 0) {
            normalizedEl[key] = Number((el[key] / el.max) * 100);
          } else {
            normalizedEl[key] = el[key];
          }
        }
        return normalizedEl;
      });

      // console.log({ normalizedResult }, "RESULT");

      return normalizedResult;
    }),
  fetchLineData: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const years = Array.from({ length: 2010 - 2005 + 1 }, (_, i) => 2005 + i);

      const data = await ctx.prisma.censusModel.findMany({
        where: {
          FIPS: {
            in: input,
          },
          year: {
            in: years,
          },
        },
        select: {
          year: true,
          state: true,
          data: {
            where: {
              key: "B25001_001E",
            },
            select: {
              data: true,
            },
          },
        },
      });

      // [{
      //     state: "CA",
      //     color: "hsl(275, 70%, 50%)",
      //     data: [
      //       {
      //         x: 2005,
      //         y: 343253,
      //       },
      //     ],
      //   },];
      type StateDataMap = {
        [key: string]: {
          id: string;
          data: Array<{
            x: number;
            y: number;
          }>;
        };
      };
      const stateDataMap: StateDataMap = {};

      data.forEach((el) => {
        // Init obj
        if (!stateDataMap[el.state]) {
          stateDataMap[el.state] = {
            id: el.state,
            data: [],
          };
        }

        // normalize data and format
        stateDataMap[el.state]?.data.push(
          ...el.data.map((dataEl) => {
            return {
              x: el.year,
              y: Number((dataEl.data / 1000000).toFixed(2)),
            };
          })
        );
      });

      const uniqueStateData = Object.values(stateDataMap);

      // console.log({ uniqueStateData });

      return uniqueStateData;
    }),
  fetchBarData: publicProcedure
    .input(z.array(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      type Check = {
        [key: string]: string;
      };

      const check: Check = {
        B01003_001E: `Total Population`,
        B16001_002E: `Only English`,
        B16001_003E: `Spanish`,
        B16001_006E: `Other Indo-European Languages`,
        B16001_009E: `Asian and Pacific Island Languages`,
        B16001_012E: `Other Languages`,
      };

      const data = await ctx.prisma.censusModel.findMany({
        where: {
          id: {
            in: input.map((el) => el.id),
          },
        },
        select: {
          state: true,
          data: {
            where: {
              key: {
                in: [
                  "B01003_001E",
                  "B16001_002E",
                  "B16001_003E",
                  "B16001_006E",
                  "B16001_009E",
                  "B16001_012E",
                ],
              },
            },
            select: {
              key: true,
              data: true,
            },
          },
        },
      });
      // console.log({ data });

      const normalizedData = data.map((el) => {
        const totalPopulationData = el.data.find(
          (dataEl) => dataEl.key === "B01003_001E"
        );
        const totalPopulation = totalPopulationData
          ? totalPopulationData.data
          : 1;
        const lineData = el.data.reduce((acc, dataEl) => {
          if (dataEl.key !== "B01003_001E") {
            console.log({ totalPopulation, data: dataEl.data });
            acc[check[dataEl.key]] = (
              (dataEl.data / totalPopulation) *
              100
            ).toFixed(2);
          }
          return acc;
        }, {});

        return { state: el.state, ...lineData };
      });

      console.log(normalizedData);

      // [{
      //   state: "AD",
      //   "B16001_002E": 23,
      //   "B16001_003E": 23,
      //   "B16001_006E": 23,
      // },]
      return normalizedData;
    }),
});
