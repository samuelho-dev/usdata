import { useState } from "react";
import BarChart from "~/components/Bar";
import BumpChart from "~/components/Bump";
import ChartHeaders from "~/components/ChartHeaders";
import LineChart from "~/components/Line";
import RadarChart from "~/components/Radar";

import {
  type BumpDataSchema,
  type BarDataSchema,
  type LineDataSchema,
  type RadarDataSchema,
} from "~/types/schema";
import { api } from "~/utils/api";
import {
  barVariables,
  lineVariables,
  radarVariables,
} from "~/utils/censusObjects";

export default function Home() {
  const statesQuery = api.fetch.fetchStates.useQuery(undefined, {
    cacheTime: Infinity,
  });
  const datasetMutation = api.fetch.fetchDatasetsByYear.useMutation();
  const radarDataMutation = api.fetch.fetchRadarData.useMutation();
  const lineDataMutation = api.fetch.fetchLineData.useMutation();
  const barDataMutation = api.fetch.fetchBarData.useMutation();
  const bumpDataMutation = api.fetch.fetchBumpData.useMutation();

  const [selectedDate, setSelectedDate] = useState(2005);
  const [selectedStates, setSelectedStates] = useState<
    { FIPS: string; state: string }[]
  >([]);

  const [radarData, setRadarData] = useState<RadarDataSchema[] | null>(null);
  const [lineData, setLineData] = useState<LineDataSchema[] | null>(null);
  const [barData, setBarData] = useState<BarDataSchema[] | null>(null);
  const [bumpData, setBumpData] = useState<BumpDataSchema[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStateSelection = (FIPS: string, state: string) => {
    setSelectedStates((prevState) => {
      const foundState = prevState.find((item) => item.FIPS === FIPS);
      if (foundState) {
        return prevState.filter((existingItem) => existingItem.FIPS !== FIPS);
      } else {
        return [...prevState, { FIPS, state }];
      }
    });
  };

  const handleDataMutation = async () => {
    setLoading(true);
    // Grab the associated models related to the states & year for Census Data
    const dataModels = await datasetMutation.mutateAsync({
      year: selectedDate,
      ids: selectedStates.map((el) => el.FIPS),
    });

    const radarQueryData = await radarDataMutation.mutateAsync(dataModels);
    setRadarData(radarQueryData);

    const lineQueryData = await lineDataMutation.mutateAsync(
      selectedStates.map((el) => el.FIPS)
    );
    setLineData(lineQueryData);

    const bumpQueryData = await bumpDataMutation.mutateAsync(
      selectedStates.map((el) => el.FIPS)
    );
    setBumpData(bumpQueryData);

    const barQueryData = await barDataMutation.mutateAsync(dataModels);
    setBarData(barQueryData);

    setLoading(false);
  };

  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center overflow-y-scroll bg-gradient-to-b from-[#0A145A] to-[#0c0c19]">
      <div className="flex h-full max-w-3xl flex-col items-center justify-center gap-12 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Data{" "}
          <span className="bg-gradient-to-b from-[#dd1f1f] to-[#f73e3e] bg-clip-text text-transparent">
            USA
          </span>
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-center gap-4">
            {statesQuery.data?.years?.map((el) => (
              <button
                type="button"
                onClick={() => setSelectedDate(el.year)}
                className={`rounded-lg  px-1 hover:cursor-pointer hover:bg-[#0A145A] hover:text-white hover:outline hover:outline-1 hover:outline-white ${
                  el.year === selectedDate
                    ? "bg-[#2638C4] text-white"
                    : "bg-white"
                }`}
                key={el.year}
              >
                {el.year}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {statesQuery.data?.states?.map((dataset) => (
              <button
                key={dataset.FIPS}
                onClick={() =>
                  void handleStateSelection(dataset.FIPS, dataset.state)
                }
                className={`rounded-lg  px-2 hover:cursor-pointer hover:bg-[#0A145A] hover:text-white hover:outline hover:outline-1 hover:outline-white  ${
                  selectedStates
                    .map((state) => state.FIPS)
                    .includes(dataset.FIPS)
                    ? "bg-[#2638C4] text-white"
                    : "bg-white"
                }`}
              >
                {dataset.state}
              </button>
            ))}
          </div>
          {loading ? (
            <div>
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-[#2638C4] text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button
              className="w-fit rounded-md bg-[#FE704E] px-4 font-semibold"
              disabled={statesQuery.data ? false : true}
              onClick={() => void handleDataMutation()}
            >
              Go
            </button>
          )}
        </div>

        <div
          className={`flex w-full flex-col items-center justify-center gap-20`}
        >
          {lineData && (
            <div className="flex h-full w-full flex-col">
              <h2 className="whitespace-nowrap text-xl tracking-tight text-white underline decoration-[#FFCF00] underline-offset-8">
                Total Housing Units Over Time
              </h2>
              <div className="h-96">
                <LineChart data={lineData} />
              </div>
              <p className="text-md py-4 tracking-tight text-white ">
                Growth of total housing units over time.
              </p>
              <ChartHeaders variables={lineVariables} />
            </div>
          )}
          {radarData && (
            <div className="flex h-full w-full flex-col">
              <h2 className="text-xl tracking-tight text-white underline decoration-[#FFCF00] underline-offset-8">
                Relative State Comparasion (Education - Income - Cost of Rent -
                Home Ownership)
              </h2>
              <div className="h-96">
                <RadarChart data={radarData} />
              </div>
              <p className="text-md py-4 tracking-tight text-white ">
                Comparasion of important KPIs for each state, dataset has been
                normalized in comparasion to the max value of each variable.
              </p>
              <ChartHeaders variables={radarVariables} />
            </div>
          )}
          {bumpData && (
            <div className="flex h-full w-full flex-col">
              <h2 className="whitespace-nowrap text-xl tracking-tight text-white underline decoration-[#FFCF00] underline-offset-8">
                Ranked By Average Housing Price Index (ASC) (1975 - 2023)
              </h2>
              <div className="h-96">
                <BumpChart data={bumpData} />
              </div>
              <div>
                <p className="text-md py-4 tracking-tight text-white ">
                  Higher HPI (Higher ranking) may be more desireable to
                  investors due to the appreciation of housing value. Lower HPI
                  indicates a slower rate in increasing housing prices,
                  resulting in more affordable housing.
                </p>
                <h5 className="text-lg text-white">
                  Variables Used - Fred Economic Data
                </h5>
                <p className="text-sm text-white">
                  <span className="text-sm text-[#FE704E]">STPHPI</span> :
                  All-Transactions House Price Index
                </p>
              </div>
            </div>
          )}

          {barData && (
            <div className="flex h-full w-full flex-col">
              <h2 className="whitespace-nowrap text-xl tracking-tight text-white underline decoration-[#FFCF00] underline-offset-8">
                Languages Spoken At Home
              </h2>
              <div className="h-96">
                <BarChart data={barData} />
              </div>
              <p className="text-md py-4 tracking-tight text-white ">
                Diversity of languages spoken at home. Normalized based on state
                population.
              </p>
              <ChartHeaders variables={barVariables} />
            </div>
          )}
        </div>

        <h5 className="flex w-full justify-end gap-1 text-base font-thin tracking-tight text-white">
          👋 Created by
          <a
            className="font-semibold text-[#FE704E] underline underline-offset-2"
            href="https://samuelho.space"
            target="_blank"
          >
            Samuel Ho
          </a>
        </h5>
      </div>
    </main>
  );
}
