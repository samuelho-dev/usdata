import React from "react";
import BarChart from "./Bar";
import RadarChart from "./Radar";
import LineChart from "./Line";

interface GraphInterface {
  graph: string;
  data: string[];
}

const data = [
  {
    taste: "fruity",
    chardonay: 49,
    carmenere: 20,
    syrah: 105,
  },
  {
    taste: "bitter",
    chardonay: 52,
    carmenere: 113,
    syrah: 69,
  },
  {
    taste: "heavy",
    chardonay: 34,
    carmenere: 61,
    syrah: 89,
  },
  {
    taste: "strong",
    chardonay: 87,
    carmenere: 76,
    syrah: 75,
  },
  {
    taste: "sunny",
    chardonay: 92,
    carmenere: 45,
    syrah: 81,
  },
];

function GraphSelection(selection: string) {
  switch (selection) {
    case "Radar":
      return <RadarChart data={data} />;
    case "Bar":
      return <BarChart />;
    case "Line":
      return <LineChart />;
    default:
      return <h1>Loading ...</h1>;
  }
}

function Graph({ graph }: GraphInterface) {
  return (
    <div className="h-80">
      <div>Graph</div>
      {GraphSelection(graph)}
    </div>
  );
}

export default Graph;
