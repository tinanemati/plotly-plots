import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

export default function RegionTable({ regionData }) {
  // we need to get time range and calculated areas from the LinePlot
  const [rowData, setRowData] = useState();

  useEffect(() => {
    if (regionData) {
      setRowData(regionData);
    }
  }, [regionData]);

  const gridOptions = {
    columnDefs: [
      { field: "Name", width: 90 },
      { field: "Channel", width: 74 },
      { field: "TimeRange", headerName: "Time Range", width: 111 },
      { field: "CalculatedArea", headerName: "Area", width: 80 },
    ],
  };
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
    }),
    []
  );
  return (
    <div className="ag-theme-balham" style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={gridOptions.columnDefs}
        defaultColDef={defaultColDef}
      ></AgGridReact>
    </div>
  );
}
