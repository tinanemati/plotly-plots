import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

export default function PeakTable({regionData}) {
  // we need to get time range and calculated areas from the LinePlot
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    if (regionData.length !== 0){
      setRowData(regionData)
    }
  }, [regionData])
  
  const gridOptions = {
    columnDefs: [
    { field: "Name", width: 90 },
    { field: "Channel",  width: 90 },
    { field: "TimeRange", headerName: "Time Range",  width: 95 },
    { field: "CalculatedArea", headerName: "Area",  width: 90 },
  ]};

  return (
    <div className="ag-theme-balham" style={{ height: "100%", width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={gridOptions.columnDefs}></AgGridReact>
    </div>
  );
}
