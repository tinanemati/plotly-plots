import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);
  const [yDataBase, setYdataBase] = useState([]);
  const [baseline, setBaseline] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [horizontalLinePosition, setHorizontalLinePosition] = useState();

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
  };

  const updateyDataBase = (newData) => {
    setYdataBase(newData);
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
        updateyDataBase={updateyDataBase}
        updateRegionData={updateRegionData}
        horizontalLinePosition={horizontalLinePosition}
        updatehorizontalLinePosition={updatehorizontalLinePosition}
      />
      <LinePlot
        xData={xData}
        yData={yData}
        baseline={baseline}
        yDataBase={yDataBase}
        regionData={regionData}
        horizontalLinePosition={horizontalLinePosition}
        updateRegionData={updateRegionData}
      />
    </div>
  );
}
