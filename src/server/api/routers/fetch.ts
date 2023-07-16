import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { barVariables, radarVariables } from "~/utils/censusObjects";

export const fetchRouter = createTRPCRouter({
  fetchStates: publicProcedure.query(async ({ ctx }) => {
    const states = await ctx.prisma.censusModel.findMany({
      select: {
        id: true,
        FIPS: true,
        state: true,
      },
      distinct: ["state"],
    });

    const years = await ctx.prisma.censusModel.findMany({
      select: {
        year: true,
      },
      distinct: ["year"],
    });

    return {
      states: states,
      years: years,
    };
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

      return data;
    }),
  fetchRadarData: publicProcedure
    .input(z.array(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.censusData.findMany({
        where: {
          census_id: {
            in: input.map((el) => el.id),
          },
          key: {
            in: Object.keys(radarVariables),
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

      // {
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
        // First item is key, init max
        if (!obj[item.key]) {
          obj[item.key] = {
            key: radarVariables[item.key],
            max: 0,
          } as DataObject;
        }

        // Take the state as the key, data value
        const value = Number(item.data) / 100;
        (obj[item.key] as StateData)[item.census_model.state] = value;

        // Update max value if current value is larger

        if (value > (obj[item.key] as DataObject).max) {
          (obj[item.key] as DataObject).max = value;
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
            // Divide by the max
            normalizedEl[key] = (Number(el[key]) / el.max) * 100;
          } else {
            normalizedEl[key] = el[key];
          }
        }
        return normalizedEl;
      });

      return normalizedResult;
    }),
  fetchLineData: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const years = Array.from({ length: 2020 - 2005 + 1 }, (_, i) => 2005 + i);

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

        // normalize data and format (000,000)
        stateDataMap[el.state]?.data.push(
          ...el.data.map((dataEl) => {
            return {
              x: el.year,
              y: Number((Number(dataEl.data) / 1000000).toFixed(2)),
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
                in: Object.keys(barVariables),
              },
            },
            select: {
              key: true,
              data: true,
            },
          },
        },
      });

      const normalizedData = data.map((el) => {
        const totalPopulationData = el.data.find(
          (dataEl) => dataEl.key === "B01003_001E"
        );
        // Need to account for errors/gaps in data
        // Use average population in each state if doesnt exist
        const totalPopulation = totalPopulationData
          ? Number(totalPopulationData.data)
          : 5763868;

        type LanguageData = {
          [language: string]: string | null;
        };

        const lineData = el.data.reduce<LanguageData>((acc, dataEl) => {
          if (dataEl.key !== "B01003_001E") {
            const keyName = barVariables[dataEl.key];
            if (keyName) {
              if (
                dataEl.data &&
                totalPopulation &&
                !isNaN(Number(dataEl.data))
              ) {
                acc[keyName] = (
                  (Number(dataEl.data) / totalPopulation) *
                  100
                ).toFixed(2);
              } else {
                // Handle case where dataEl.data cannot be converted to a number
                acc[keyName] = null;
              }
            }
          }
          return acc;
        }, {});

        return { state: el.state, ...lineData };
      });

      // [{
      //   state: "AD",
      //   "B16001_002E": 23,
      //   "B16001_003E": 23,
      //   "B16001_006E": 23,
      // },]
      return normalizedData;
    }),
  fetchBumpData: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.fredModel.findMany({
        where: {
          FIPS: {
            in: input,
          },
        },
        select: {
          state: true,
          year: true,
          data: {
            select: {
              data: true,
            },
          },
        },
        distinct: ["state", "year"],
      });
      // Output Given
      // [
      //   {
      //     state: "GA",
      //     year: 1975,
      //     data: [ { data: 73 }, { data: 71 }, { data: 74 }, { data: 73 } ]
      //   },
      //   {
      //     state: "GA",
      //     year: 1976,
      //     data: [[Object], [Object], [Object], [Object]],
      //   },
      // ];

      // Output Needed
      // [
      //   {
      //     id: "State",
      //     data: [
      //       {
      //         x: 2000,
      //         y: 1,
      //       },
      //       {
      //         x: 2001,
      //         y: 1,
      //       },
      //     ],
      //   },
      //   {
      //     id: "State2",
      //     data: [
      //       {
      //         x: 2000,
      //         y: 2,
      //       },
      //       {
      //         x: 2001,
      //         y: 2,
      //       },
      //     ],
      //   },
      // ];
      type dataObj = { state: string; data: number };
      const stateMap = new Map<number, dataObj[]>();

      data.forEach((el) => {
        const average =
          el.data.reduce((acc, dataEl) => acc + Number(dataEl.data), 0) /
          el.data.length;

        if (stateMap.has(el.year)) {
          stateMap.get(el.year)?.push({ state: el.state, data: average });
        } else {
          stateMap.set(el.year, [{ state: el.state, data: average }]);
        }
      });

      const formattedData = Array.from(stateMap.entries()).map(
        ([state, data]) => ({
          id: state,
          data: data,
        })
      );

      // [
      //   {
      //     id: 1975,
      //     data: [
      //       { state: "HI", data: 58.5 },
      //       { state: "NJ", data: 61.25 },
      //     ],
      //   },
      // ];

      const rankedData = formattedData.map((el) => {
        const sortedArr = el.data.sort((a, b) => a.data - b.data).reverse();
        // Sort the data and assign ranking by index
        const result = sortedArr.map((dataEl, i) => {
          return { state: dataEl.state, data: i + 1 };
        });

        return { id: el.id, data: result };
      });

      // [
      //   { id: 1975, data: [ [Object], [Object], [Object] ] },
      // ]
      type resultObj = { x: number; y: number };

      const resultMap = new Map<string, resultObj[]>();
      rankedData.forEach((el) => {
        el.data.forEach((dataEl) => {
          if (resultMap.has(dataEl.state)) {
            resultMap.get(dataEl.state)?.push({ x: el.id, y: dataEl.data });
          } else {
            resultMap.set(dataEl.state, [{ x: el.id, y: dataEl.data }]);
          }
        });
      });

      // console.log(
      //   Array.from(resultMap, ([state, data]) => ({
      //     id: state,
      //     data: data,
      //   }))
      // );

      return Array.from(resultMap, ([state, data]) => ({
        id: state,
        data: data,
      }));
    }),
});
