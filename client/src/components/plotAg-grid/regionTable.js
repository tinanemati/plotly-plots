import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

export default function RegionTable() {
  const [rowData] = useState([
    { Name: "Toyota", Channel: "Celica", TimeRange: 35000, CalculatedArea: 0 },
    { Name: "Ford", Channel: "Mondeo", TimeRange: 32000, CalculatedArea: 0 },
    { Name: "Porsche", Channel: "Boxter", TimeRange: 72000, CalculatedArea: 0 },
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
