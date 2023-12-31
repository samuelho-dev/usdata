import React from "react";
import dynamic from "next/dynamic";
import { type BumpDataSchema } from "~/types/schema";

const ResponsiveBumpChart = dynamic(
  () => import("@nivo/bump").then((m) => m.ResponsiveBump),
  { ssr: false }
);

const theme = {
  text: {
    fontSize: 11,
    fill: "#ffffff",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  axis: {
    domain: {
      line: {
        stroke: "#ffffff",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 10,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    text: {
      fontSize: 11,
      fill: "#ffffff",
      outlineWidth: 0,
      outlineColor: "transparent",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "#ffffff",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#ffffff",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    container: {
      background: "#ffffff",
      fontSize: 12,
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
};

interface BumpChartComponentSchema {
  data: BumpDataSchema[];
}

//{ data }: BumpChartComponentSchema
const BumpChart = ({ data }: BumpChartComponentSchema) => (
  <ResponsiveBumpChart
    data={data}
    theme={theme}
    interpolation="smooth"
    colors={{ scheme: "green_blue" }}
    xPadding={0.25}
    lineWidth={2}
    pointSize={3}
    inactiveLineWidth={1}
    inactiveOpacity={0.15}
    inactivePointSize={0}
    activeLineWidth={4}
    activePointSize={10}
    activePointBorderWidth={2}
    pointColor={{ theme: "background" }}
    pointBorderWidth={3}
    pointBorderColor={{ from: "serie.color" }}
    enableGridX={false}
    axisTop={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 50,
      legend: "Years",
      legendPosition: "middle",
      legendOffset: 36,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Ranking",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
    axisRight={null}
  />
);

export default BumpChart;
