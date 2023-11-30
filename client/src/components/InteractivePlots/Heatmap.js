import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import data from "../../sample-data.json";
import Heatmapconfig from "../PlotConfig/Heatmapconfig";

export default function Heatmap({
  updatexData,
  updateyData,
  updateRegionData,
}) {
  const [arrayX, setArrayX] = useState([]);
  const [arrayY, setArrayY] = useState([]);
  const [arrayZ, setArrayZ] = useState([]);
  const [horizontalLinePosition, setHorizontalLinePosition] = useState();
  const [hoverActive, setHoverActive] = useState(true);
  const [zMin, setZMin] = useState(null);
  const [zMax, setZMax] = useState(null);
  const [zMinSci, setZMinSci] = useState(null);
  const [zMaxSci, setZMaxSci] = useState(null);
  const [minLimit, setMinLimit] = useState(null);
  const [maxLimit, setMaxLimit] = useState(null);
  const [configValue, setConfigValue] = useState("Select (m/z) slices");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };

  //console.log("this is the configValue:", configValue);
  console.log("this is the state of zmin and zmax:", zMin, zMax);
  console.log("this is the state of zminSci and zmaxSci:", zMinSci, zMaxSci);
  

  // console.log("this is arrayZ: ", arrayZ);
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

  // Function to convert a number to scientific notation
  function toScientificNotation(num) {
    // Check if the number is zero, return 0 in scientific notation
    if (num === 0) return "0";

    // Get the exponent for scientific notation
    const exponent = Math.floor(Math.log10(Math.abs(num)));

    // Calculate the coefficient for scientific notation
    const coefficient = num / Math.pow(10, exponent);

    // Format the result in scientific notation
    return `${coefficient.toFixed(1)} × 10^${exponent}`;
  }

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
      setZMinSci(toScientificNotation(parseFloat(min)));
      setZMaxSci(toScientificNotation(parseFloat(max)));
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
      //updateRegionData([])
      setHoverActive(false); // Disable hover after click
    }
  };

  const handleDoubleClick = () => {
    setHoverActive(true);
    updateRegionData([]);
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
  // Update zmin and zmax scientific based on the new value of zmin and zmax
  useEffect(() => {
    if (zMax && zMin) {
      setZMinSci(toScientificNotation(parseFloat(zMin)));
      setZMaxSci(toScientificNotation(parseFloat(zMax)));
    }
  }, [zMin, zMax])

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

  const scrollZoom = configValue === "Scroll Zoom & Pan" ? true : false;
  const dragMode = configValue === "Scroll Zoom & Pan" ? "pan" : false;
  const doubleClickHandler =
    configValue === "Select (m/z) slices" ? handleDoubleClick : () => {};
  const onHoverHandler =
    configValue === "Select (m/z) slices" ? handleHover : () => {};
  const onClickHandler =
    configValue === "Select (m/z) slices" ? handleClick : () => {};

  return (
    <div
      className="Heatmap-style"
      style={{
        display: "flex",
        alignItems: "center",
      }}
      onWheel={handleWheel}
    >
      <Heatmapconfig
        configValue={configValue}
        updateConfigValue={updateConfigValue}
        zMaxSci={zMaxSci}
        zMinSci={zMinSci}
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
              exponentformat: "power",
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
          dragmode: dragMode,
        }}
        onHover={onHoverHandler}
        onClick={onClickHandler}
        onDoubleClick={doubleClickHandler}
        config={{ scrollZoom: scrollZoom, displayModeBar: false }}
      />
    </div>
  );
}
