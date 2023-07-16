import React from "react";

interface ChartHeadersInterface {
  [key: string]: string;
}

function ChartHeaders({ variables }: { variables: ChartHeadersInterface }) {
  return (
    <div>
      <h5 className="text-lg text-white">Variables Used</h5>
      {Object.keys(variables).map((chartVar, i) => (
        <p className="text-sm text-white" key={i}>
          <span className="text-[#FE704E]">{chartVar}</span>
          {` : ${variables[chartVar] as string}`}
        </p>
      ))}
    </div>
  );
}

export default ChartHeaders;
