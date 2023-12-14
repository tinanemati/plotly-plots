import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import RegionTable from "../plotAg-grid/RegionTable";
import Lineplotconfig from "../PlotConfig/Lineplotconfig";

export default function LinePlot({
  xData,
  yData,
  baseline,
  horizontalLinePosition,
  updateRegionData,
  updateBaseline,
  regionData,
}) {
  const [hoverActive, setHoverActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [xDataUpdated, setXdataUpdated] = useState([]);
  const [baselineUpdated, setBaselineUpdated] = useState(false);
  const [range, setRange] = useState([]);
  // Function to update the range at a specific index
  const updateRange = (index, newLeft, newRight) => {
    const updatedRanges = [...range];
    updatedRanges[index] = { leftside: newLeft, rightside: newRight };
    setRange(updatedRanges);
  };
  const [leftside, setLeftside] = useState(0);
  const [area, setArea] = useState([]);
  // Function to update the area at a specific index
  const updateArea = (index, newArea) => {
    const updatedareas = [...area];
    updatedareas[index] = { calculatedArea: newArea };
    setArea(updatedareas);
  };
  const [baselineTimeRange, setBaselineTimeRange] = useState([]);
  const [pointClicked, setPointClicked] = useState([]);
  // Function that will update the baseline range
  const updateBaselineTimeRange = (pointX) => {
    const selectedTimes = [...baselineTimeRange];
    selectedTimes.push(pointX);
    setBaselineTimeRange(selectedTimes);
  };
  console.log("this is my range:", range);
  // console.log("this is the baseline range we have:", baselineTimeRange);
  // console.log("this is the points we have clicked:", pointClicked);
  // console.log("how many times i have been clicked:", clickCount);
  console.log("is hover active:", hoverActive);
  // console.log("area:", area);
  const [configValue, setConfigValue] = useState("Scroll Zoom & Pan");
  const updateConfigValue = (newValue) => {
    setConfigValue(newValue);
  };

  useEffect(() => {
    if (configValue === "Integration") {
      setHoverActive(true);
    } else if (configValue === "Baseline") {
      setHoverActive(false);
    } else if (configValue === "Reset") {
      setHoverActive(false);
      setLeftside(0);
      setClickCount(0);
      setArea([]);
      setRange([]);
      setIndex(0);
      updateRegionData([]);
      setBaselineTimeRange([]);
      setPointClicked([]);
      setBaselineUpdated(false);
    } else {
      setHoverActive(false);
    }
  }, [configValue]);

  useEffect(() => {
    if (area.length > 0) {
      const updatedRegions = range.map((item, index) => {
        const regionName = `Region ${index + 1}`;
        const channel = "MS 1";
        const power = Math.pow(10, 3);
        const { leftside, rightside } = item;
        const calculatedArea = area[index].calculatedArea.toFixed(5);
        const start_time = Math.trunc(xData[leftside] * power) / power;
        const end_time = Math.trunc(xData[rightside - 1] * power) / power;
        const timeRange = `[${start_time} : ${end_time})`;

        return {
          Name: regionName,
          Channel: channel,
          TimeRange: timeRange,
          CalculatedArea: calculatedArea,
        };
      });

      updateRegionData(updatedRegions);
    }
  }, [area]);

  // Reset the setting when we selecet a new slice and table data gets updated
  // useEffect(() => {
  //   if (regionData.length === 0) {
  //     setHoverActive(false);
  //     setLeftside(0);
  //     setClickCount(0);
  //     setArea([]);
  //     setRange([]);
  //     setIndex(0);
  //     setConfigValue("Scroll Zoom & Pan");
  //     setBaselineTimeRange([]);
  //     setPointClicked([]);
  //   }
  // }, [regionData]);

  const handleHover = (data) => {
    if (hoverActive && clickCount === 1) {
      const hoverPointIndex = data.points[0].pointIndex;
      // Let's update the range here as well so we can see it when we hover on the plot
      updateRange(index, leftside, hoverPointIndex);
    }
  };

  const handleClickIntegration = (data) => {
    if (hoverActive) {
      // check if we currently have any regions and the point that was clicked is the same as the rightside
      if (
        range.length > 0 &&
        data.points[0].x === xData[range[index].rightside - 1]
      ) {
        // update clicked count to '1'
        setClickCount(1);
      } else {
        // Increase the click count by 1 each time the plot is clicked
        setClickCount((prevCount) => prevCount + 1);
      }
      // Check how many times the button has been clicked
      if (clickCount === 0) {
        const clickPointIndex = data.points[0].pointIndex; // this will be the left side of our integral
        setLeftside(clickPointIndex);
        setIndex(range.length);
      } else if (clickCount === 1) {
        const clickPointIndex = data.points[0].pointIndex; // this will be the right side of our integral
        setHoverActive(false); // after we get the second point stop listening for new points
        // Let's update the range here
        updateRange(index, leftside, clickPointIndex);
      }
    }
  };
  const handleClickBaseline = (data) => {
    const clickedPointIndex = data.points[0].pointIndex;
    const updatedClickedPoints = pointClicked.includes(clickedPointIndex)
      ? pointClicked.filter((index) => index !== clickedPointIndex)
      : [...pointClicked, clickedPointIndex];
    setPointClicked(updatedClickedPoints);
    const xValue = xData[clickedPointIndex];
    //console.log("onClick", data.points[0]);
    updateBaselineTimeRange(xValue);
  };
  const handleDoubleClick = () => {
    setHoverActive(true);
    setClickCount(0);
  };
  const handleDoubleClickBaseline = () => {
    //console.log("you double cliked on baseline feature")
    setBaselineTimeRange([]);
    setPointClicked([]);
    setBaselineUpdated(false);
  };
  // Function for baseline correction
  const performBaselineCorrection = async (requestData) => {
    try {
      const response = await fetch("/baselineCorrection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // Get the error message from server side and display to user
        const errorData = await response.json();
        console.log(errorData);
      }

      const responseData = await response.json();
      updateBaseline(responseData.baseline);
      setBaselineUpdated(true);
      setXdataUpdated(responseData.times);
      console.log("I got response:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Function for area calculation
  const performAreaCalculation = async (requestData) => {
    try {
      const response = await fetch("/area", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // Get the error message from server side and display to user
        const errorData = await response.json();
        console.log(errorData);
      }

      const responseData = await response.json();
      console.log(
        "this is my area calculated by the server:",
        responseData.area
      );
      updateArea(index, responseData.area);
      // Handle further processing based on the backend response
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // make a request to the backend to calculated baseline
  const baselineCorrection = () => {
    let dataToSend;
    // if user has selected some baseline point, perform basline fitting operation
    if (baselineUpdated && baselineTimeRange.length >= 2) {
      dataToSend = {
        xData: xData,
        yData: yData,
        baselineTimeRange: [
          {
            noise_start: Math.min(...baselineTimeRange),
            noise_end: Math.max(...baselineTimeRange),
          },
        ],
      };
      performBaselineCorrection(dataToSend);
    } else if (baselineTimeRange.length === 0) {
      dataToSend = {
        xData: xData,
        yData: yData,
        baselineTimeRange: [
          {
            noise_start: xData[0],
            noise_end: xData[xData.length - 1],
          },
        ],
      };
      performBaselineCorrection(dataToSend);
    }
  };

  // Hook that will update the baseline calculation accordingly
  useEffect(() => {
    baselineCorrection();
  }, [baselineTimeRange.length, baselineUpdated]);

  // make request to the backend to calculate area
  const areaCalculation = () => {
    let dataToSend;
    if (clickCount === 2 && baseline !== undefined) {
      dataToSend = {
        range: range[index],
        xData: xData,
        yData: yData,
        baseline: baseline,
      };
    }
    performAreaCalculation(dataToSend);
  };

  // Hook that will update the area calculation accordingly
  useEffect(() => {
    areaCalculation();
  }, [clickCount]);

  const scrollZoom = configValue === "Scroll Zoom & Pan" ? true : false;
  const dragMode = configValue === "Scroll Zoom & Pan" ? "pan" : false;
  const doubleClickHandler =
    configValue === "Integration"
      ? handleDoubleClick
      : configValue === "Baseline"
      ? handleDoubleClickBaseline
      : () => {};
  const clickHandler =
    configValue === "Integration"
      ? handleClickIntegration
      : configValue === "Baseline"
      ? handleClickBaseline
      : () => {};

  const markerColors = xData.map((_, index) =>
    pointClicked.includes(index) ? "#fe0000" : "#000"
  );

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
            name: `(m/z) slice`,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: markerColors, size: 3 },
            line: {
              color: "#000",
              width: 1,
            },
          },
          ...(range.length > 0
            ? range.map((item, index) => ({
                x: xData.slice(item.leftside, item.rightside),
                y: yData.slice(item.leftside, item.rightside),
                xref: "y",
                yref: "x",
                type: "scatter",
                mode: "lines",
                line: {
                  color: "rgb(238,44,130)",
                },
                name: area[index] ? `Region ${index + 1}` : undefined,
              }))
            : []),
        ]}
        layout={{
          width: 950,
          height: 570,
          title: "Extracted Ion Chromatogram",
          xaxis: {
            title: "Retention Time (Minute)",
          },
          yaxis: {
            title: `Ion Count (m/z=${horizontalLinePosition})`,
            zeroline: false,
          },
          dragmode: dragMode,
          shapes:
            baselineTimeRange.length === 0 && baseline !== undefined
              ? [
                  {
                    type: "line",
                    xref: "x",
                    x0: xData[0],
                    x1: xData[xData.length - 1],
                    yref: "y",
                    y0: baseline[0],
                    y1: baseline[baseline.length - 1],
                    line: {
                      dash: "dot",
                      color: "#5450e4",
                      width: 2,
                    },
                  },
                ]
              : baselineUpdated === true &&
                baselineTimeRange.length >= 2 &&
                xDataUpdated.length > 0
              ? [
                  {
                    type: "line",
                    xref: "x",
                    x0: xDataUpdated[0],
                    x1: xDataUpdated[xDataUpdated.length - 1],
                    yref: "y",
                    y0: baseline[0],
                    y1: baseline[baseline.length - 1],
                    line: {
                      dash: "dot",
                      color: "#5450e4",
                      width: 2,
                    },
                  },
                ]
              : [],
        }}
        config={{
          scrollZoom: scrollZoom,
          displayModeBar: false,
        }}
        onHover={handleHover}
        onClick={clickHandler}
        onDoubleClick={doubleClickHandler}
      />
      <div style={{ height: "200px", width: "350px" }}>
        <RegionTable regionData={regionData} />
      </div>
    </div>
  );
}
