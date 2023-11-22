import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);
  // const [yData1, setY1data] = useState([]);
  // const [zData, setZdata] = useState([]);

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
  };
  // const updatey1Data = (newData) => {
  //   setY1data(newData);
  // };
  // const updatezData = (newData) => {
  //   setZdata(newData);
  // };

  /* Testing
  console.log("this is my xData for line plotL: ", xData)
  console.log("this is my yData for line plot", yData)
  console.log("this is my zData for line plotL: ", zData);
  */
  return (
    <div>
      <h1>Test Heatmap Components</h1>

      <Heatmap
        updatexData={updatexData}
        updateyData={updateyData}
        // updatezData={updatezData}
        // updatey1Data={updatey1Data}
      />
      <LinePlot xData={xData} yData={yData} />

      {/* <Histogram zData={zData} /> */}
    </div>
  );
}
