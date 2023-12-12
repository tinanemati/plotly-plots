import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);
  const [newYData, setNewYData] = useState([]);
  const [baseline, setBaseline] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [horizontalLinePosition, setHorizontalLinePosition] = useState();

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
  };
  const updatenewYData = (newData) => {
    setNewYData(newData);
  };
  const updateBaseline = (newData) => {
    setBaseline(newData);
  };
  const updatehorizontalLinePosition = (newData) => {
    setHorizontalLinePosition(newData);
  };

  const updateRegionData = (newData) => {
    setRegionData(newData);
  };

  /* Testing
  console.log("this is my xData for line plotL: ", xData)
  console.log("this is my yData for line plot", yData)
  console.log("this is my regionData for line plot and table: ", regionData);
  
  */
  return (
    <div>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Test Interactive Plots
      </h1>

      <Heatmap
        updatexData={updatexData}
        updateyData={updateyData}
        updateBaseline={updateBaseline}
        updatenewYData={updatenewYData}
        updateRegionData={updateRegionData}
        horizontalLinePosition={horizontalLinePosition}
        updatehorizontalLinePosition={updatehorizontalLinePosition}
      />
      <LinePlot
        xData={xData}
        yData={yData}
        baseline={baseline}
        newYData={newYData}
        regionData={regionData}
        horizontalLinePosition={horizontalLinePosition}
        updateRegionData={updateRegionData}
      />
    </div>
  );
}
