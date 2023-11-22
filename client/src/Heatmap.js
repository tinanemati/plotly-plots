import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import data from "./sample-data.json";
import Heatmapconfig from "./PlotConfig/Heatmapconfig";

export default function Heatmap({ updatexData, updateyData }) {
  const [arrayX, setArrayX] = useState([]);
  const [arrayY, setArrayY] = useState([]);
  const [arrayZ, setArrayZ] = useState([]);
  const [horizontalLinePosition, setHorizontalLinePosition] = useState();
  const [hoverActive, setHoverActive] = useState(true);
  const [zMin, setZMin] = useState(null);
  const [zMax, setZMax] = useState(null);
  const [prevXRange, setPrevXRange] = useState(null);
  const [prevYRange, setPrevYRange] = useState(null);
  const [minLimit, setMinLimit] = useState(null);
  const [maxLimit, setMaxLimit] = useState(null);
  const [configValue, setConfigValue] = useState("");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };

  //console.log("this is the configValue:", configValue);
  //console.log("this is the state of zmin and zmax:", zMin, zMax);
  // console.log(
  //   "this is the state of minLimit and maxLimit:",
  //   minLimit,
  //   maxLimit
  // );
  // console.log(
  //   "this is the state of prevXRange and prevYRange:",
  //   prevXRange,
  //   prevYRange
  // );

  // Calculate zmin and zmax from arrayZ data
  useEffect(() => {
    if (arrayZ.length > 0) {
      let min = arrayZ[0][0];
      let max = arrayZ[0][0];

      // Iterate through arrayZ to find the minimum and maximum values
      arrayZ.forEach((row) => {
        row.forEach((value) => {
          if (value < min) {
            min = value; // Update min if a smaller value is found
          }
          if (value > max) {
            max = value; // Update max if a larger value is found
          }
        });
      });

      // Set zMin and zMax states with calculated values
      setZMin(min);
      setZMax(max);
      setMinLimit(min);
      setMaxLimit(max);
    }
  }, [arrayZ]);

  // Hook to fetch data from the Flask server
  useEffect(() => {
    const xData = data.columns;
    const yData = data.index;
    const zData = data.values;

    setArrayX(xData);
    setArrayY(yData);
    setArrayZ(zData);
    setHorizontalLinePosition(yData[0]);
    updateyData(zData[0]);
    updatexData(xData);
    // Calculate x and y ranges
    const { xRange, yRange } = calculateAxisRanges(xData, yData);
    setPrevXRange(xRange);
    setPrevYRange(yRange);
  }, []);

  const handleHover = (data) => {
    if (hoverActive) {
      const clickedPointIndex = data.points[0].pointIndex[0];
      const yValue = arrayY[clickedPointIndex]; // Get the y-axis value where the user clicked
      setHorizontalLinePosition(yValue);
      updateyData(arrayZ[clickedPointIndex]);
      //console.log("onHover", data.points[0], "testing finding x using pointIndex:", arrayZ[data.points[0].pointIndex[0]])
    }
  };

  const handleClick = (data) => {
    if (hoverActive) {
      const clickedPointIndex = data.points[0].pointIndex[0];
      const yValue = arrayY[clickedPointIndex];
      setHorizontalLinePosition(yValue);
      updateyData(arrayZ[clickedPointIndex]);
      setHoverActive(false); // Disable hover after click
    }
  };

  const handleDoubleClick = () => {
    setHoverActive(true);
  };
  const calculateAxisRanges = (xData, yData) => {
    if (xData.length === 0 || yData.length === 0) {
      return { xRange: [0, 1], yRange: [0, 1] }; // Default ranges if data is empty
    }

    const xMin = Math.min(...xData);
    const xMax = Math.max(...xData);
    const yMin = Math.min(...yData);
    const yMax = Math.max(...yData);

    return { xRange: [xMin, xMax], yRange: [yMin, yMax] };
  };

  const handleWheel = (event) => {
    //console.log("this is my event:", event);
    if (event.deltaY < 0 && configValue === "Update zMin") {
      // zoom-in

      // Increment zMin only on zoom-in events
      //console.log("scrolling up");
      //console.log("I am increasing zMin", zMin);
      setZMin((prevZMin) => Math.min(maxLimit, prevZMin + 1000));
    } else if (event.deltaY > 0 && configValue === "Update zMin") {
      //zoom-out
      // decremeant zMin only on zoom-in events
      //console.log("I am decreasing zMin", zMin);
      setZMin((prevZMin) => Math.max(minLimit, prevZMin - 1000));
      //console.log("scrolling down");
    } else if (event.deltaY < 0 && configValue === "Update zMax") {
      //console.log("I am increasing zMax", zMax);
      setZMax((prevZMax) => Math.min(maxLimit, prevZMax + 1000));
    } else if (event.deltaY > 0 && configValue === "Update zMax") {
      //zoom-out
      //console.log("I am decreasing zMax", zMax);
      setZMax((prevZMax) => Math.max(minLimit, prevZMax - 1000));
    }
  };
  useEffect(() => {
    if (configValue === "Reset") {
      setZMax(maxLimit);
      setZMin(minLimit);
    } else if (configValue === "Update zMax" || configValue === "Update zMin") {
      const cancelWheel = (event) => event.preventDefault();

      document.body.addEventListener("wheel", cancelWheel, { passive: false });

      return () => {
        document.body.removeEventListener("wheel", cancelWheel);
      };
    }
  }, [configValue]);

  const scrollZoom = configValue === "Scroll Zoom" ? true : false;

  return (
    <div
      className="Heatmap-style"
      style={{
        display: "flex",
        alignItems: "center",
        overscrollBehavior: "contain",
      }}
      onWheel={handleWheel}
    >
      <Heatmapconfig
        configValue={configValue}
        updateConfigValue={updateConfigValue}
      />
      <Plot
        data={[
          {
            z: arrayZ,
            x: arrayX,
            y: arrayY,
            type: "heatmap",
            colorscale: "Viridis",
            zmax: zMax,
            zmin: zMin,
            zauto: false,
            colorbar: {
              len: 0.8,
              thickness: 20,
            },
          },
        ]}
        layout={{
          width: 950,
          height: 570,
          title: "Total Ion Chromatogram",
          xaxis: {
            title: {
              text: "Retention Time (Minutes)",
            },
          },
          yaxis: {
            autorange: "reversed",
            title: {
              text: "(m/z)",
            },
          },
          shapes: [
            {
              type: "line",
              xref: "paper",
              x0: 0,
              x1: 1,
              yref: "y",
              y0: horizontalLinePosition,
              y1: horizontalLinePosition,
              line: {
                color: "#6ECEB2",
                width: 2,
              },
            },
          ],
          dragmode: "pan", // Enable panning
        }}
        onHover={handleHover}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        config={{ scrollZoom: scrollZoom, displaylogo: false, displayModeBar: false }}
      />
    </div>
  );
}
