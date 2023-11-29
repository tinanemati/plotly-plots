import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

export default function RegionTable() {
  const [rowData] = useState([
    { Name: "Region 1", Channel: "MS 1", TimeRange: "[ : ]", CalculatedArea: 0 },
    { Name: "Region 2", Channel: "MS 1", TimeRange: "[ : ]", CalculatedArea: 0 },
    { Name: "Region 3", Channel: "MS 1", TimeRange: "[ : ]", CalculatedArea: 0 },
  ]);

  const [columnDefs] = useState([
    { field: "Name", width: 90 },
    { field: "Channel",  width: 90 },
    { field: "TimeRange", headerName: "Time Range",  width: 95 },
    { field: "CalculatedArea", headerName: "Area",  width: 90 },
  ]);
  return (
    <div className="ag-theme-balham" style={{ height: "100%", width: "100%" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
}
