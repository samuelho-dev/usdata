import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "process";

const prisma = new PrismaClient();

const statesKey = [
  { state: "Alabama", abbr: "AL", FIPS: "01" },
  { state: "Alaska", abbr: "AK", FIPS: "02" },
  { state: "Arizona", abbr: "AZ", FIPS: "04" },
  { state: "Arkansas", abbr: "AR", FIPS: "05" },
  { state: "California", abbr: "CA", FIPS: "06" },
  { state: "Colorado", abbr: "CO", FIPS: "08" },
  { state: "Connecticut", abbr: "CT", FIPS: "09" },
  { state: "Delaware", abbr: "DE", FIPS: "10" },
  { state: "District of Columbia", abbr: "DC", FIPS: "11" },
  { state: "Florida", abbr: "FL", FIPS: "12" },
  { state: "Georgia", abbr: "GA", FIPS: "13" },
  { state: "Hawaii", abbr: "HI", FIPS: "15" },
  { state: "Idaho", abbr: "ID", FIPS: "16" },
  { state: "Illinois", abbr: "IL", FIPS: "17" },
  { state: "Indiana", abbr: "IN", FIPS: "18" },
  { state: "Iowa", abbr: "IA", FIPS: "19" },
  { state: "Kansas", abbr: "KS", FIPS: "20" },
  { state: "Kentucky", abbr: "KY", FIPS: "21" },
  { state: "Louisiana", abbr: "LA", FIPS: "22" },
  { state: "Maine", abbr: "ME", FIPS: "23" },
  { state: "Maryland", abbr: "MD", FIPS: "24" },
  { state: "Massachusetts", abbr: "MA", FIPS: "25" },
  { state: "Michigan", abbr: "MI", FIPS: "26" },
  { state: "Minnesota", abbr: "MN", FIPS: "27" },
  { state: "Mississippi", abbr: "MS", FIPS: "28" },
  { state: "Missouri", abbr: "MO", FIPS: "29" },
  { state: "Montana", abbr: "MT", FIPS: "30" },
  { state: "Nebraska", abbr: "NE", FIPS: "31" },
  { state: "Nevada", abbr: "NV", FIPS: "32" },
  { state: "New Hampshire", abbr: "NH", FIPS: "33" },
  { state: "New Jersey", abbr: "NJ", FIPS: "34" },
  { state: "New Mexico", abbr: "NM", FIPS: "35" },
  { state: "New York", abbr: "NY", FIPS: "36" },
  { state: "North Carolina", abbr: "NC", FIPS: "37" },
  { state: "North Dakota", abbr: "ND", FIPS: "38" },
  { state: "Ohio", abbr: "OH", FIPS: "39" },
  { state: "Oklahoma", abbr: "OK", FIPS: "40" },
  { state: "Oregon", abbr: "OR", FIPS: "41" },
  { state: "Pennsylvania", abbr: "PA", FIPS: "42" },
  { state: "Rhode Island", abbr: "RI", FIPS: "44" },
  { state: "South Carolina", abbr: "SC", FIPS: "45" },
  { state: "South Dakota", abbr: "SD", FIPS: "46" },
  { state: "Tennessee", abbr: "TN", FIPS: "47" },
  { state: "Texas", abbr: "TX", FIPS: "48" },
  { state: "Utah", abbr: "UT", FIPS: "49" },
  { state: "Vermont", abbr: "VT", FIPS: "50" },
  { state: "Virginia", abbr: "VA", FIPS: "51" },
  { state: "Washington", abbr: "WA", FIPS: "53" },
  { state: "West Virginia", abbr: "WV", FIPS: "54" },
  { state: "Wisconsin", abbr: "WI", FIPS: "55" },
  { state: "Wyoming", abbr: "WY", FIPS: "56" },
];

const censusKeyObj = {
  B01003_001E: "total_population",
  B01002_001E: "median_age",
  B11001_001E: "total_households",
  B11001_002E: "family_households",
  B11001_007E: "nonfamily_households",
  B15003_001E: "total_population_over_25",
  B15003_022E: "bachelor_degree_or_higher",
  B16001_001E: "total_population_over_5",
  B16001_002E: "speak_only_english_at_home",
  B16001_003E: "speak_spanish_at_home",
  B16001_006E: "speak_other_indo_european_languages_at_home",
  B16001_009E: "speak_asian_and_pacific_island_languages_at_home",
  B16001_012E: "speak_other_languages_at_home",
  B05002_001E: "total_population",
  B05002_002E: "native_born",
  B05002_013E: "foreign_born",
  B05002_014E: "foreign_born_naturalized_us_citizen",
  B05002_021E: "foreign_born_not_us_citizen",
  B19013_001E: "median_household_income",
  B23025_005E: "unemployment_rate",
  B19301_001E: "per_capita_income",
  B17001_002E: "below_poverty_level",
  B25064_001E: "median_gross_rent",
  B25077_001E: "median_value_owner_occupied_housing_units",
  B25001_001E: "total_housing_units",
  B25002_003E: "vacant_housing_units",
  B25003_002E: "owner_occupied_housing_units",
  B25003_003E: "renter_occupied_housing_units",
};

async function createCensusData(
  values: string[],
  year: number,
  census_variable: string,
  state: string,
  FIPS: string
) {
  try {
    await prisma.censusData.create({
      data: {
        census_model: {
          connectOrCreate: {
            where: {
              year_FIPS: {
                year: year,
                FIPS: FIPS,
              },
            },
            create: {
              year: year,
              state: state,
              FIPS: FIPS,
            },
          },
        },
        census_key: {
          connect: {
            census_variable: census_variable,
          },
        },
        data: Number(values[0]) * 100,
      },
    });
  } catch (err) {
    console.error(
      `Error creating data for ${state}, year : ${year}, and key ${Number(
        values[0]
      )}`,
      err
    );
  }
}

async function fetchCensus(year: number) {
  const variables = Object.keys(censusKeyObj);

  for (const el of statesKey) {
    for (const varEl of variables) {
      try {
        const response = await axios.get(
          `https://api.census.gov/data/${year}/acs/acs1?get=${varEl}&for=state:${
            el.FIPS
          }&key=${env.CENSUS_API_KEY as string}`
        );

        const values = response.data as string[][];

        await createCensusData(
          values[1] as string[],
          year,
          varEl,
          el.abbr,
          el.FIPS
        );
      } catch (err) {
        console.log(
          `Error with axios request for ${el.abbr}-${el.FIPS}, ${varEl}`
        );

        try {
          // CREATE A NULL ENTRY IF FAILED
          await prisma.censusData.create({
            data: {
              census_model: {
                connectOrCreate: {
                  where: {
                    year_FIPS: {
                      year: year,
                      FIPS: el.FIPS,
                    },
                  },
                  create: {
                    year: year,
                    state: el.abbr,
                    FIPS: el.FIPS,
                  },
                },
              },
              census_key: {
                connect: {
                  census_variable: varEl,
                },
              },
              data: null,
            },
          });
        } catch (err) {
          console.error("Prisma Null invalid");
          throw err;
        }
      }
    }
  }
}

async function fredDataScrape() {
  // {
  //   "realtime_start": "2013-08-14",
  //   "realtime_end": "2013-08-14",
  //   "observation_start": "1776-07-04",
  //   "observation_end": "9999-12-31",
  //   "units": "lin",
  //   "output_type": 1,
  //   "file_type": "json",
  //   "order_by": "observation_date",
  //   "sort_order": "asc",
  //   "count": 84,
  //   "offset": 0,
  //   "limit": 100000,
  //   "observations": [
  //       {
  //           "realtime_start": "2013-08-14",
  //           "realtime_end": "2013-08-14",
  //           "date": "1929-01-01",
  //           "value": "1065.9"
  //       },]
  // }

  for (const el of statesKey) {
    const series_id = `${el.abbr}STHPI`;
    try {
      console.log(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${
          env.FRED_API_KEY as string
        }&file_type=json`
      );
      const response = await axios.get(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${
          env.FRED_API_KEY as string
        }&file_type=json`
      );
      type dataArraySchema = {
        realtime_start: string;
        realtime_end: string;
        date: string;
        value: string;
      };

      type responseSchema = {
        realtime_start: string;
        realtime_end: string;
        observation_start: string;
        observation_end: string;
        units: string;
        output_type: number;
        file_type: string;
        order_by: string;
        sort_order: string;
        count: number;
        offset: number;
        limit: number;
        observations: dataArraySchema[];
      };

      const dataArray = (response.data as responseSchema).observations;

      for (const data of dataArray) {
        try {
          await prisma.fredData.create({
            data: {
              data: Number(data.value),
              key: series_id,
              fred_model: {
                connectOrCreate: {
                  where: {
                    year_FIPS: {
                      year: Number(data.date.slice(0, 4)),
                      FIPS: el.FIPS,
                    },
                  },
                  create: {
                    year: Number(data.date.slice(0, 4)),
                    state: el.abbr,
                    FIPS: el.FIPS,
                  },
                },
              },
            },
          });
        } catch (err) {
          await prisma.fredData.create({
            data: {
              data: null,
              key: series_id,
              fred_model: {
                connectOrCreate: {
                  where: {
                    year_FIPS: {
                      year: Number(data.date.slice(4)),
                      FIPS: el.FIPS,
                    },
                  },
                  create: {
                    year: Number(data.date.slice(4)),
                    state: el.abbr,
                    FIPS: el.FIPS,
                  },
                },
              },
            },
          });
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

async function censusKeySeed() {
  for (const [censusKey, description] of Object.entries(censusKeyObj)) {
    await prisma.censusKey.create({
      data: {
        census_variable: censusKey,
        description: description,
      },
    });
  }
}

async function seed() {
  try {
    await censusKeySeed();
    await fredDataScrape();
    for (let i = 2005; i <= 2010; i++) {
      await fetchCensus(i);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    return await prisma.$disconnect();
  }
}

seed()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
