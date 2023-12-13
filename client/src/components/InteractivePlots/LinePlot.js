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
  regionData,
}) {
  const [hoverActive, setHoverActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [index, setIndex] = useState(0);
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
  const [baselineRange, setBaselineRange] = useState({
    xValues: [],
    yValues: [],
  });
  const [pointClicked, setPointClicked] = useState([]);
  // Function that will update the baseline range
  const updateBaselineRange = (xValue, yValue) => {
    setBaselineRange((prevState) => ({
      ...prevState,
      xValues: [...prevState.xValues, xValue],
      yValues: [...prevState.yValues, yValue],
    }));
  };
  console.log("this is the baseline range we have:", baselineRange);
  console.log(
    "what is this?",
    Math.min(...baselineRange.xValues),
    Math.min(...baselineRange.yValues)
  );
  console.log("this is the points we have clicked:", pointClicked);
  //console.log("how many times i have been clicked:", clickCount);
  //console.log("is hover active:", hoverActive);
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
        const calculatedArea =
          Math.trunc(area[index].calculatedArea * power) / power;
        const start_time = Math.trunc(xData[leftside] * power) / power;
        const end_time = Math.trunc(xData[rightside - 1] * power) / power;
        const timeRange = `[${start_time} : ${end_time}]`;

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
  //console.log("this is the data for table:", regionData);

  useEffect(() => {
    if (regionData.length === 0) {
      setHoverActive(false);
      setLeftside(0);
      setClickCount(0);
      setArea([]);
      setRange([]);
      setIndex(0);
      setConfigValue("Scroll Zoom & Pan");
    }
  }, [regionData]);

  const handleHover = (data) => {
    if (hoverActive && clickCount === 1) {
      const hoverPointIndex = data.points[0].pointIndex;
      // Let's update the range here as well so we can see it when we hover on the plot
      updateRange(index, leftside, hoverPointIndex);
    }
  };

  const handleClickIntegration = (data) => {
    console.log("we are here:", data.points[0])
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
    const yValue = yData[clickedPointIndex];
    console.log("onClick", data.points[0]);
    updateBaselineRange(xValue, yValue);
  };
  const handleDoubleClick = () => {
    setHoverActive(true);
    setClickCount(0);
  };
  const handleDoubleClickBaseline = () => {
    //console.log("you double cliked on baseline feature")
    setBaselineRange({ xValues: [], yValues: [] });
    setPointClicked([]);
  };
  useEffect(() => {
    // make a request to the backend if click count is equal to two
    const makeRequest = async () => {
      if (clickCount === 2 && baselineRange.xValues.length === 0) {
          const dataToSend = {
            range: range[index],
            xData: xData,
            yData: yData,
            baseline: baseline,
          };
          try {
            const response = await fetch("/area", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
              // Get the error message from server side and display to user
              const errorData = await response.json();
              console.log(errorData);
            }

            const responseData = await response.json();
            // console.log(
            //   "this is my area calculated by the server:",
            //   responseData.area
            // );
            updateArea(index, responseData.area);
            // Handle further processing based on the backend response
          } catch (error) {
            console.error("Error:", error);
          }
        } else if (clickCount === 2 && baselineRange.xValues.length > 0) {
          const dataToSend = {
            xData: xData,
            yData: yData,
            baselineTimeRange: baselineRange.xValues,
            regionTime: {min_time: xData[range[index].leftside], max_time: xData[range[index].rightside]},
          };
          try {
            const response = await fetch("/baselineCorrection", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
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
      }
    };
    makeRequest();
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
                fill: "tozeroy",
                fillcolor: "#97ccc8",
                type: "scatter",
                line: {
                  color: "#1975d2",
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
            baselineRange.xValues.length === 0
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
              : baselineRange.xValues.length > 0
              ? [
                  {
                    type: "line",
                    xref: "x",
                    x0: Math.min(...baselineRange.xValues),
                    x1: Math.max(...baselineRange.xValues),
                    yref: "y",
                    y0: Math.min(...baselineRange.yValues),
                    y1: Math.max(...baselineRange.yValues),
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
