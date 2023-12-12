import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function SamplePlot() {
  const [pointClicked, setPointClicked] = useState([]);
  const arrayX = [1, 2, 3];
  const arrayY = [2, 6, 3];
  const markerColors = arrayX.map((_, index) =>
    pointClicked.includes(index) ? "green" : "red"
  );
  const handleClick = (data) => {
    const clickedPointIndex = data.points[0].pointIndex;
    const updatedClickedPoints = pointClicked.includes(clickedPointIndex)
        ? pointClicked.filter((index) => index !== clickedPointIndex)
        : [...pointClicked, clickedPointIndex];
    setPointClicked(updatedClickedPoints)
    console.log("onClick", data.points[0], "and this is my cliked points:", updatedClickedPoints);
  };
  return (
    <Plot
      data={[
        {
          x: arrayX,
          y: arrayY,
          type: "scatter",
          mode: "lines+markers",
          marker: {
            color: markerColors,
          },
        },
      ]}
      layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
      onClick={handleClick}
    />
  );
}
