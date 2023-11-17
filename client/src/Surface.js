import React from "react";
import Plot from "react-plotly.js";


export default function Surface({ xData, yData1, zData }) {
// Create a layout for the Surface plot
const surfaceLayout = {
    width: 950,
    height: 570,
    title: 'Surface Plot of zData',
    scene: {
      xaxis: {
        title: 'X Axis Title',
        tickvals: xData, // Set x-axis tick values
        ticktext: xData.map(String), // Set x-axis tick labels
      },
      yaxis: {
        title: 'Y Axis Title',
        tickvals: yData1, // Set y-axis tick values
        ticktext: yData1.map(String), // Set y-axis tick labels
      },
      zaxis: {
        title: 'Z Axis Title',
      },
    },
  };
  
  // Create data for the Surface plot
  const surfaceData = [{
    z: zData,
    type: 'surface',
    colorscale: 'Viridis', // You can specify the colorscale here
  }];
  
  // Render the Surface plot
  return (
    <Plot
      data={surfaceData}
      layout={surfaceLayout}
    />
  );
  }