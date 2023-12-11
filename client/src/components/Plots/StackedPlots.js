import React from "react";
import Plot from "react-plotly.js";
import sampleData from "../../sample-data.json";

export default function StackedPlots({ xData, yData }) {
  const arrayX = sampleData.columns;
  const arrayY = sampleData.index;
  const arrayZ = sampleData.values;

  var trace1 = {
    z: arrayZ,
    x: arrayX,
    y: arrayY,
    type: "heatmap",
    colorscale: "Viridis",
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
    x: xData,
    y: yData,
    xaxis: "x2",
    yaxis: "y2",
    name: "(m/z) slice",
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "#6ECEB2" },
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
