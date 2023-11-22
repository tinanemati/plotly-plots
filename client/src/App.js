import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
  };

  /* Testing
  console.log("this is my xData for line plotL: ", xData)
  console.log("this is my yData for line plot", yData)
  console.log("this is my zData for line plotL: ", zData);
  */
  return (
    <div>
      <h1 style={{display:"flex", justifyContent: "center"}}>Test Interactive Plots</h1>

      <Heatmap updatexData={updatexData} updateyData={updateyData} />
      <LinePlot xData={xData} yData={yData} />
    </div>
  );
}
