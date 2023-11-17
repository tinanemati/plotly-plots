import React from "react";
import Plot from "react-plotly.js";

export default function LinePlot({xData, yData}) {

  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "#6ECEB2" },
        },
      ]}
      layout={{
        width: 950,
        height: 570,
        title: "Extracted Ion Chromatogram",
        xaxis: {
          title: "Retention Time (Minute)",
        },
        yaxis: {
          title: "Ion Count",
        //   fixedrange: true,
        },
        dragmode: "pan", // Enable panning
      }}
      config={{ scrollZoom: true, displaylogo: false }} // Enable scroll zoom
    />
  );
}
