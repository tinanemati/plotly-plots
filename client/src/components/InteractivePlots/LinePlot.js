import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Lineplotconfig from "../PlotConfig/Lineplotconfig";

export default function LinePlot({ xData, yData }) {
  const [hoverActive, setHoverActive] = useState(false);
  const [configValue, setConfigValue] = useState("Standard");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };
  useEffect(() => {
    if (configValue === "Integration") {
      console.log("this is where we have to apply the integration logic");
      setHoverActive(true);
      console.log(
        "when we are in the integration the hover mode should be set to true:",
        hoverActive
      );
    } else if (configValue === "Baseline") {
      console.log("this is where we have to apply the baseline logic");
    } else if (configValue === "Reset") {
      console.log("this is where we will apply the reset logic");
    }
  }, [configValue]);

  const scrollZoom = configValue === "Standard" ? true : false;
  const dragMode = configValue === "Standard" ? "pan" : false;

  const handleHover = (data) => {
    if (hoverActive) {
      const hoverPointIndex = data.point[0].pointIndex;
      const xValue = xData[hoverPointIndex]
      console.log(
        "onHover",
        data.points[0],
        "testing finding x using pointIndex:",
        xValue
      );
    }
  };

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
          // {
          //   x: xData.slice(0, xData.length + 1),
          //   y: yData.slice(
          //     0,
          //     xData.length + 1
          //   ),
          //   fill: "tozeroy",
          //   fillcolor: "#97ccc8",
          //   type: "scatter",
          //   line: {
          //     color: "#1975d2"
          //   },
          // },
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
          dragmode: dragMode,
        }}
        config={{
          scrollZoom: scrollZoom,
          displaylogo: false,
          displayModeBar: false,
        }}
        onHover={handleHover}
      />
    </div>
  );
}
