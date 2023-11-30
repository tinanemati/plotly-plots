import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function Heatmapconfig({
  configValue,
  updateConfigValue,
  zMaxSci,
  zMinSci,
}) {
  const options = [
    "Select (m/z) slices",
    "Scroll Zoom & Pan",
    "Update zMin",
    "Update zMax",
    "Reset",
  ];
  //console.log("this is the value:", configValue)

  const handleChange = (event) => {
    updateConfigValue(event.target.value);
  };
  
  return (
    <FormControl sx={{ display: "flex" }}>
      <FormLabel sx={{ marginLeft: "10px" }}>Heatmap options:</FormLabel>
      <RadioGroup
        name="Heatmapconfig-radio-buttons-group"
        value={configValue}
        onChange={handleChange}
        sx={{ marginLeft: "10px" }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={
              option === "Update zMin" ? (
                <span>
                  {option} <strong>{zMinSci}</strong>
                </span>
              ) : option === "Update zMax" ? (
                <span>
                  {option} <strong>{zMaxSci}</strong>
                </span>
              ) : (
                option
              )
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
