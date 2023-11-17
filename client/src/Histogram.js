import React from "react";
import Plot from "react-plotly.js";

export default function Histogram({ zData }) {
  // Flatten the zData array
  const flattenZ = zData.reduce((acc, val) => acc.concat(val), []);

  // Define the number of bins
  const numberOfBins = 100;

  // Calculate the minimum and maximum values from flattenZ
  const minValue = Math.min(...flattenZ);
  const maxValue = Math.max(...flattenZ);

  // Calculate the bin width
  const binWidth = (maxValue - minValue) / numberOfBins;

  // Initialize an array to store the counts for each bin
  const binCounts = new Array(numberOfBins).fill(0);

  // Calculate counts for each bin
  flattenZ.forEach(value => {
    const binIndex = Math.floor((value - minValue) / binWidth);
    if (binIndex >= 0 && binIndex < numberOfBins) {
      binCounts[binIndex]++;
    }
  });

  // Apply log10(1+count) transformation
  const transformedCounts = binCounts.map(count => ({
    x: minValue + binCounts.indexOf(count) * binWidth, // Bin starting point
    y: Math.log10(1 + count), // Apply log10(1+count)
  }));

  const histogramLayout = {
    width: 950,
    height: 570,
    title: "Distribution of zData Values",
    xaxis: {
        title: {
          text: "Bins",
        },
      },
      yaxis: {
        title: {
          text: "log10(1 + Count)",
        },
      },
  };
  return (
    <Plot
    data={[
        {
          x: transformedCounts.map(bin => bin.x),
          y: transformedCounts.map(bin => bin.y),
          type: "bar",
          marker: {
            color: "#6ECEB2",
          },
        },
      ]}
      layout={histogramLayout}
    />
  );
}
