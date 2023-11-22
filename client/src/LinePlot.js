import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Lineplotconfig from "./PlotConfig/Lineplotconfig";

export default function LinePlot({ xData, yData }) {
  const [configValue, setConfigValue] = useState("");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };
  useEffect(() => {
    if (configValue === "Integration") {
      console.log("this is where we have to apply the integration logic")
    } else if (configValue === "Baseline") {
        console.log("this is where we have to apply the baseline logic")
    } else if (configValue === "Reset") {
        console.log("this is where we will apply the reset logic")
    }
  }, [configValue]);

  const scrollZoom = configValue === "Standard" ? true : false;
  const dragMode = configValue === "Standard" ?  "pan" : false;

  return (
    <div
      className="lineplot-style"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Lineplotconfig
        configValue={configValue}
        updateConfigValue={updateConfigValue}
      />
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
          },
          dragmode: dragMode
        }}
        config={{ scrollZoom: scrollZoom, displaylogo: false, displayModeBar: false }}
      />
    </div>
  );
}
