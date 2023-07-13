import React from "react";
import dynamic from "next/dynamic";

const data = [
  {
    id: "japan",
    color: "hsl(275, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 145,
      },
      {
        x: "helicopter",
        y: 71,
      },
      {
        x: "boat",
        y: 153,
      },
      {
        x: "train",
        y: 126,
      },
      {
        x: "subway",
        y: 10,
      },
      {
        x: "bus",
        y: 134,
      },
      {
        x: "car",
        y: 230,
      },
      {
        x: "moto",
        y: 275,
      },
      {
        x: "bicycle",
        y: 129,
      },
      {
        x: "horse",
        y: 110,
      },
      {
        x: "skateboard",
        y: 68,
      },
      {
        x: "others",
        y: 159,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(32, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 298,
      },
      {
        x: "helicopter",
        y: 70,
      },
      {
        x: "boat",
        y: 116,
      },
      {
        x: "train",
        y: 196,
      },
      {
        x: "subway",
        y: 162,
      },
      {
        x: "bus",
        y: 190,
      },
      {
        x: "car",
        y: 287,
      },
      {
        x: "moto",
        y: 247,
      },
      {
        x: "bicycle",
        y: 73,
      },
      {
        x: "horse",
        y: 259,
      },
      {
        x: "skateboard",
        y: 70,
      },
      {
        x: "others",
        y: 297,
      },
    ],
  },
  {
    id: "us",
    color: "hsl(325, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 100,
      },
      {
        x: "helicopter",
        y: 241,
      },
      {
        x: "boat",
        y: 138,
      },
      {
        x: "train",
        y: 78,
      },
      {
        x: "subway",
        y: 187,
      },
      {
        x: "bus",
        y: 273,
      },
      {
        x: "car",
        y: 213,
      },
      {
        x: "moto",
        y: 238,
      },
      {
        x: "bicycle",
        y: 260,
      },
      {
        x: "horse",
        y: 84,
      },
      {
        x: "skateboard",
        y: 209,
      },
      {
        x: "others",
        y: 201,
      },
    ],
  },
  {
    id: "germany",
    color: "hsl(85, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 238,
      },
      {
        x: "helicopter",
        y: 170,
      },
      {
        x: "boat",
        y: 68,
      },
      {
        x: "train",
        y: 66,
      },
      {
        x: "subway",
        y: 184,
      },
      {
        x: "bus",
        y: 258,
      },
      {
        x: "car",
        y: 212,
      },
      {
        x: "moto",
        y: 70,
      },
      {
        x: "bicycle",
        y: 191,
      },
      {
        x: "horse",
        y: 125,
      },
      {
        x: "skateboard",
        y: 230,
      },
      {
        x: "others",
        y: 153,
      },
    ],
  },
  {
    id: "norway",
    color: "hsl(155, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 163,
      },
      {
        x: "helicopter",
        y: 82,
      },
      {
        x: "boat",
        y: 218,
      },
      {
        x: "train",
        y: 225,
      },
      {
        x: "subway",
        y: 71,
      },
      {
        x: "bus",
        y: 92,
      },
      {
        x: "car",
        y: 295,
      },
      {
        x: "moto",
        y: 226,
      },
      {
        x: "bicycle",
        y: 185,
      },
      {
        x: "horse",
        y: 23,
      },
      {
        x: "skateboard",
        y: 223,
      },
      {
        x: "others",
        y: 227,
      },
    ],
  },
];

const ResponsiveLineChart = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
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
        fontSize: 11,
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

const LineChart = ({ data }) => (
  <ResponsiveLineChart
    data={data}
    theme={theme}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "years",
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Total Housing Units (1,000,000)s",
      legendOffset: -50,
      legendPosition: "middle",
    }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export default LineChart;
