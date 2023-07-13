import { number, z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
      //     id: "japan",
      //     color: "hsl(275, 70%, 50%)",
      //     data: [
      //       {
      //         x: "plane",
      //         y: 145,
      //       },
      //     ],
      //   },];
      console.log({ data });

      const test = data.map((el) => {
        const dataArray = el.data.map((dataEl) => {
          dataEl.x : el.year,
          dataEl.y : dataEl.data
        })
      })

      return data;
    }),
});
