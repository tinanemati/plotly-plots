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
  // Extract the coefficient and exponent from the scientific string
  const [coefficientMax, exponentMax] = zMaxSci.split(" × 10^");
  const [coefficientMin, exponentMin] = zMinSci.split(" × 10^");

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
                  {option}{" "}
                  <strong>
                    {coefficientMin} x 10 <sup>{exponentMin}</sup>
                  </strong>
                </span>
              ) : option === "Update zMax" ? (
                <span>
                  {option}{" "}
                  <strong>
                    {coefficientMax} x 10 <sup>{exponentMax}</sup>
                  </strong>
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
