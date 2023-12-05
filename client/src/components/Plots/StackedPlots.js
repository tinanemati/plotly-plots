import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import sampleData from "../../sample-data.json";

export default function StackedPlots() {
  const xData = sampleData.columns;
  const yData = sampleData.index;
  const zData = sampleData.values;

  var trace1 = {
    z: zData,
    x: xData,
    y: yData,
    type: "heatmap",
    colorbar: {
      len: 0.4,
      thickness: 20,
      exponentformat: "power",
    },
    hovertemplate: `t: %{x}
    <br>m/z: %{y}
    <br>intensity: %{z}<extra></extra>`,
  };

  var trace2 = {
    x: [2, 3, 4],
    y: [100, 110, 120],
    xaxis: "x2",
    yaxis: "y2",
    type: "scatter",
  };

  const data = [trace1, trace2];

  const layout = {
    grid: {
      rows: 2,
      columns: 1,
      pattern: "independent",
      roworder: "bottom to top",
    },
    width: 600,
    height: 400,
    title: "Subplots with Shared Axes",
  };
  return <Plot data={data} layout={layout} />;
}
