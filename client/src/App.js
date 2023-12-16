import React, { useState } from "react";
import Heatmap from "./components/InteractivePlots/Heatmap";
import LinePlot from "./components/InteractivePlots/LinePlot";

export default function App() {
  const [xData, setXdata] = useState([]);
  const [yData, setYdata] = useState([]);
  const [yDataUpdated, setYdataUpdated] = useState([]);
  const [baseline, setBaseline] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [horizontalLinePosition, setHorizontalLinePosition] = useState();
  const [sliceSelected, setSliceSelected] = useState(false);
  const [baselineUpdated, setBaselineUpdated] = useState(false);

  const updatexData = (newData) => {
    setXdata(newData);
  };

  const updateyData = (newData) => {
    setYdata(newData);
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
  console.log("picked a slice: ", sliceSelected)
  console.log("this is my yData updated", yDataUpdated)
  console.log("this is my yData", yData)
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
        updateRegionData={updateRegionData}
        horizontalLinePosition={horizontalLinePosition}
        updatehorizontalLinePosition={updatehorizontalLinePosition}
        setSliceSelected={setSliceSelected}
        setBaselineUpdated={setBaselineUpdated}
        setYdataUpdated={setYdataUpdated}
      />
      <LinePlot
        xData={xData}
        yData={yData}
        baseline={baseline}
        regionData={regionData}
        baselineUpdated={baselineUpdated}
        sliceSelected={sliceSelected}
        yDataUpdated={yDataUpdated}
        horizontalLinePosition={horizontalLinePosition}
        updateRegionData={updateRegionData}
        updateBaseline={updateBaseline}
        setBaselineUpdated={setBaselineUpdated}
        setYdataUpdated={setYdataUpdated}
      />
    </div>
  );
}
