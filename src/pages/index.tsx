import { CensusData } from "@prisma/client";
import { useState } from "react";
import BarChart from "~/components/Bar";
import Graph from "~/components/Graph";
import LineChart from "~/components/Line";
import RadarChart from "~/components/Radar";

import { type RadarDataSchema } from "~/types/schema";
import { api } from "~/utils/api";

export default function Home() {
  const statesQuery = api.fetch.fetchStates.useQuery();
  const datasetMutation = api.fetch.fetchDatasetsByYear.useMutation();
  const radarDataMutation = api.fetch.fetchRadarData.useMutation();
  const lineDataMutation = api.fetch.fetchLineData.useMutation();

  const [selectedDate, setSelectedDate] = useState(2005);
  const [selectedStates, setSelectedStates] = useState<
    { FIPS: string; state: string }[]
  >([]);

  const [radarData, setRadarData] = useState<RadarDataSchema[] | null>(null);
  const [lineData, setLineData] = useState<RadarDataSchema[] | null>(null);

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

  const handleDate = (i: number) => {
    setSelectedDate(2005 + i);
  };

  const handleDataMutation = async () => {
    const dataModels = await datasetMutation.mutateAsync({
      year: selectedDate,
      ids: selectedStates.map((state) => state.FIPS),
    });
    console.log(dataModels, "Models");
    const radarQueryData = await radarDataMutation.mutateAsync(dataModels);
    const lineQueryData = await lineDataMutation.mutateAsync(
      selectedStates.map((el) => el.FIPS)
    );
    console.log({ lineQueryData });
    setRadarData(radarQueryData);
  };

  return (
    <main className="flex h-full min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex max-w-4xl flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Census <span className="text-[hsl(280,100%,70%)]">Data</span> App
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-center gap-4">
            {Array.from({ length: 2010 - 2005 + 1 }, (_, i) => (
              <div
                onClick={() => handleDate(i)}
                className={`rounded-lg bg-white px-1 hover:cursor-pointer hover:bg-[hsl(280,100%,70%)] ${
                  2005 + i === selectedDate ? "bg-[hsl(280,100%,70%)]" : ""
                }`}
                key={2005 + i}
              >
                {2005 + i}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {statesQuery.data?.map((dataset) => (
              <div
                key={dataset.FIPS}
                onClick={() =>
                  void handleStateSelection(dataset.FIPS, dataset.state)
                }
                className={`rounded-lg bg-white px-2 hover:cursor-pointer hover:bg-[hsl(280,100%,70%)] ${
                  selectedStates
                    .map((state) => state.FIPS)
                    .includes(dataset.FIPS)
                    ? "bg-[hsl(280,100%,70%)]"
                    : ""
                }`}
              >
                {dataset.state}
              </div>
            ))}
          </div>
          <button
            className="bg-white"
            onClick={() => void handleDataMutation()}
          >
            Go
          </button>
        </div>
        <div className="grid w-full  grid-cols-2 items-center justify-center gap-2">
          <div className="col-span-2 h-80">
            {radarData && <RadarChart data={radarData} />}
          </div>
          <div className="h-80">
            {/* {lineData && <LineChart data={lineData} />} */}
          </div>
          <div className="h-80">
            <BarChart />
          </div>
        </div>
      </div>
    </main>
  );
}
