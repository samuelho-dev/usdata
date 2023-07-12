import React from "react";
import dynamic from "next/dynamic";

const data = [
  {
    country: "AD",
    "hot dog": 23,
    "hot dogColor": "hsl(65, 70%, 50%)",
    burger: 194,
    burgerColor: "hsl(65, 70%, 50%)",
    sandwich: 58,
    sandwichColor: "hsl(104, 70%, 50%)",
    kebab: 157,
    kebabColor: "hsl(159, 70%, 50%)",
    fries: 7,
    friesColor: "hsl(324, 70%, 50%)",
    donut: 70,
    donutColor: "hsl(144, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 15,
    "hot dogColor": "hsl(146, 70%, 50%)",
    burger: 105,
    burgerColor: "hsl(29, 70%, 50%)",
    sandwich: 54,
    sandwichColor: "hsl(123, 70%, 50%)",
    kebab: 150,
    kebabColor: "hsl(33, 70%, 50%)",
    fries: 152,
    friesColor: "hsl(180, 70%, 50%)",
    donut: 102,
    donutColor: "hsl(5, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 63,
    "hot dogColor": "hsl(147, 70%, 50%)",
    burger: 53,
    burgerColor: "hsl(35, 70%, 50%)",
    sandwich: 47,
    sandwichColor: "hsl(190, 70%, 50%)",
    kebab: 142,
    kebabColor: "hsl(334, 70%, 50%)",
    fries: 57,
    friesColor: "hsl(359, 70%, 50%)",
    donut: 101,
    donutColor: "hsl(128, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 162,
    "hot dogColor": "hsl(67, 70%, 50%)",
    burger: 134,
    burgerColor: "hsl(16, 70%, 50%)",
    sandwich: 161,
    sandwichColor: "hsl(188, 70%, 50%)",
    kebab: 139,
    kebabColor: "hsl(129, 70%, 50%)",
    fries: 128,
    friesColor: "hsl(174, 70%, 50%)",
    donut: 84,
    donutColor: "hsl(128, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 166,
    "hot dogColor": "hsl(55, 70%, 50%)",
    burger: 190,
    burgerColor: "hsl(316, 70%, 50%)",
    sandwich: 112,
    sandwichColor: "hsl(70, 70%, 50%)",
    kebab: 170,
    kebabColor: "hsl(202, 70%, 50%)",
    fries: 21,
    friesColor: "hsl(356, 70%, 50%)",
    donut: 4,
    donutColor: "hsl(133, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 127,
    "hot dogColor": "hsl(304, 70%, 50%)",
    burger: 3,
    burgerColor: "hsl(311, 70%, 50%)",
    sandwich: 86,
    sandwichColor: "hsl(301, 70%, 50%)",
    kebab: 33,
    kebabColor: "hsl(11, 70%, 50%)",
    fries: 77,
    friesColor: "hsl(203, 70%, 50%)",
    donut: 83,
    donutColor: "hsl(9, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 24,
    "hot dogColor": "hsl(92, 70%, 50%)",
    burger: 75,
    burgerColor: "hsl(282, 70%, 50%)",
    sandwich: 3,
    sandwichColor: "hsl(212, 70%, 50%)",
    kebab: 109,
    kebabColor: "hsl(126, 70%, 50%)",
    fries: 111,
    friesColor: "hsl(283, 70%, 50%)",
    donut: 131,
    donutColor: "hsl(175, 70%, 50%)",
  },
];

const ResponsiveBarChart = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
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

const BarChart = () => (
  <ResponsiveBarChart
    data={data}
    theme={theme}
    keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
    indexBy="country"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "nivo" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#38bcb2",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "#eed312",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "fries",
        },
        id: "dots",
      },
      {
        match: {
          id: "sandwich",
        },
        id: "lines",
      },
    ]}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "country",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "food",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    role="application"
    ariaLabel="Nivo bar chart demo"
  />
);

export default BarChart;
