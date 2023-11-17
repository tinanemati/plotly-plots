import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

export default function SamplePlot() {
  const [arrayX, setArrayX] = useState([1, 2, 3]);
  const [arrayY, setArrayY] = useState([2, 6, 3]);

  return (
    <Plot
      data={[
        {
          x: arrayX,
          y: arrayY,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        },
        { type: "bar", x: arrayX, y: arrayY },
      ]}
      layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
    />
  );
}
