import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import RegionTable from "../plotAg-grid/RegionTable";
import Lineplotconfig from "../PlotConfig/Lineplotconfig";

export default function LinePlot({
  xData,
  yData,
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
  console.log(
    "this is the range we have:",
    range,
    "this is my index:",
    index,
    "this is my area:",
    area
  );
  console.log("how many times i have been clicked:", clickCount);
  console.log("is hover active:", hoverActive);
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
  console.log("this is the data for table:", regionData);

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

  const handleClick = (data) => {
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
      // Check if it's the first or second time the button is clicked
      if (clickCount === 0) {
        //console.log("This is the first time you clicked.");
        const clickPointIndex = data.points[0].pointIndex; // this will be the left side of our integral
        //const xValue = xData[clickPointIndex];
        // console.log(
        //   "onClick",
        //   data.points[0],
        //   "testing finding left side x using pointIndex:",
        //   xValue
        // );
        setLeftside(clickPointIndex);
        setIndex(range.length);
      } else if (clickCount === 1) {
        //console.log("This is the second time you clicked.");
        const clickPointIndex = data.points[0].pointIndex; // this will be the right side of our integral
        // const xValue = xData[clickPointIndex];
        // console.log(
        //   "onClick",
        //   data.points[0],
        //   "testing finding right side x using pointIndex:",
        //   xValue
        // );
        setHoverActive(false); // after we get the second point stop listening for new points
        // Let's update the range here
        updateRange(index, leftside, clickPointIndex);
      }
    }
  };

  const handleDoubleClick = () => {
    setHoverActive(true);
    setClickCount(0);
  };

  useEffect(() => {
    // make a request to the backend if click count is equal to two
    const makeRequest = async () => {
      if (clickCount === 2) {
        const dataToSend = {
          xDataRange: xData.slice(
            range[index].leftside,
            range[index].rightside
          ),
          yDataRange: yData.slice(
            range[index].leftside,
            range[index].rightside
          ),
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
      }
    };
    makeRequest();
  }, [clickCount]);

  const scrollZoom = configValue === "Scroll Zoom & Pan" ? true : false;
  const dragMode = configValue === "Scroll Zoom & Pan" ? "pan" : false;
  const doubleClickHandler =
    configValue === "Integration" ? handleDoubleClick : () => {};

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
            mode: "lines",
            marker: { color: "#6ECEB2" },
          },
          ...(range.length > 0
            ? range.map((item, index) => ({
                x: xData.slice(item.leftside, item.rightside),
                y: yData.slice(item.leftside, item.rightside),
                fill: "tozeroy",
                fillcolor: "#97ccc8",
                type: "scatter",
                line: {
                  color: "#1975d2",
                },
                name: area[index] ? `Region ${index + 1}` : undefined,
              }))
            : [
                {
                  // Placeholder data or an empty trace if range is empty
                  x: 0,
                  y: 0,
                  type: "scatter",
                  name: "No Data",
                },
              ]),
        ]}
        layout={{
          width: 950,
          height: 570,
          title: "Extracted Ion Chromatogram",
          xaxis: {
            title: "Retention Time (Minute)",
          },
          yaxis: {
            title:  `Ion Count (m/z=${horizontalLinePosition})`,
          },
          dragmode: dragMode,
        }}
        config={{
          scrollZoom: scrollZoom,
          displayModeBar: false,
        }}
        onHover={handleHover}
        onClick={handleClick}
        onDoubleClick={doubleClickHandler}
      />
      <div style={{ height: "200px", width: "350px" }}>
        <RegionTable regionData={regionData} />
      </div>
    </div>
  );
}
