import React, { useEffect, useState } from "react";
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
  const [coefficientMax, setCoefficientMax] = useState();
  const [coefficientMin, setCoefficientMin] = useState();
  const [exponentMin, setExponentMin] = useState();
  const [exponentMax, setExponentMax] = useState();

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
  useEffect(() => {
    if (zMaxSci && zMaxSci) {
      // Extract the coefficient and exponent from the scientific string
      const [coefficientMax, exponentMax] = zMaxSci.split(" × 10^");
      setCoefficientMax(coefficientMax);
      setExponentMax(exponentMax);
      const [coefficientMin, exponentMin] = zMinSci.split(" × 10^");
      setCoefficientMin(coefficientMin);
      setExponentMin(exponentMin);
    }
  }, [zMaxSci, zMinSci]);

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
                  {coefficientMin !== "0" ? (
                    <strong>
                      {coefficientMin} x 10<sup>{exponentMin}</sup>
                    </strong>
                  ) : (
                    <strong>{coefficientMin}</strong>
                  )}
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
