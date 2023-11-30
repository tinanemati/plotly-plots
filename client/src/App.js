import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);
  const [regionData, setRegionData] = useState([]);

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
  };

  const updateRegionData = (newData) => {
    setRegionData(newData);
  };

  console.log("this is my regionData for line plot and table: ", regionData);
  /* Testing
  console.log("this is my xData for line plotL: ", xData)
  console.log("this is my yData for line plot", yData)
  
  */
  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Test Interactive Plots
      </h1>

      <Heatmap
        updatexData={updatexData}
        updateyData={updateyData}
        updateRegionData={updateRegionData}
      />
      <LinePlot
        xData={xData}
        yData={yData}
        regionData={regionData}
        updateRegionData={updateRegionData}
      />
    </div>
  );
}
