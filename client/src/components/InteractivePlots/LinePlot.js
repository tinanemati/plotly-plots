import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Lineplotconfig from "../PlotConfig/Lineplotconfig";

export default function LinePlot({ xData, yData }) {
  const [hoverActive, setHoverActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [leftside, setLeftside] = useState(0);
  const [rightside, setRightside] = useState(0);
  console.log("this is the left side of my integral:", leftside, "this is the right side:", rightside)
  console.log("how many times i have been clicked:", clickCount)
  const [configValue, setConfigValue] = useState("Standard");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };
  useEffect(() => {
    if (configValue === "Integration") {
      console.log("this is where we have to apply the integration logic");
      setHoverActive(true);
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
      const hoverPointIndex = data.points[0].pointIndex;
      const xValue = xData[hoverPointIndex];
      console.log(
        "onHover",
        data.points[0],
        "testing finding x using pointIndex:",
        xValue
      );
    }
  };

  const handleClick = (data) => {
    if (hoverActive) {
      // Increase the click count by 1 each time the plot is clicked
      setClickCount((prevCount) => prevCount + 1);
      // Check if it's the first or second time the button is clicked
      if (clickCount === 0) {
        console.log("This is the first time you clicked.");
        const clickPointIndex = data.points[0].pointIndex; // this will be the left side of our integral
        const xValue = xData[clickPointIndex];
        console.log(
          "onClick",
          data.points[0],
          "testing finding left side x using pointIndex:",
          xValue
        );
        setLeftside(clickPointIndex)
      } else if (clickCount === 1) {
        console.log("This is the second time you clicked.");
        const clickPointIndex = data.points[0].pointIndex; // this will be the right side of our integral
        const xValue = xData[clickPointIndex];
        console.log(
          "onClick",
          data.points[0],
          "testing finding right side x using pointIndex:",
          xValue
        );
        setRightside(clickPointIndex)
        setHoverActive(false) // after we get the second point stop listening for new points
      } 
    }
  };

  const handleDoubleClick = () => {
    setHoverActive(true);
    setClickCount(0)
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
          {
            x: xData.slice(leftside, rightside),
            y: yData.slice(
              leftside,
              rightside
            ),
            fill: "tozeroy",
            fillcolor: "#97ccc8",
            type: "scatter",
            line: {
              color: "#1975d2"
            },
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
          dragmode: dragMode,
        }}
        config={{
          scrollZoom: scrollZoom,
          displaylogo: false,
          displayModeBar: false,
        }}
        onHover={handleHover}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />
    </div>
  );
}
