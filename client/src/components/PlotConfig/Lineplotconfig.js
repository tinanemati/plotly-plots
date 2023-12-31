import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function Lineplotconfig({ configValue, updateConfigValue }) {
  const options = ["Scroll Zoom & Pan","Integration", "Baseline", "Reset"];
  //console.log("this is the value:", configValue)

  const handleChange = (event) => {
    updateConfigValue(event.target.value);
  };

  return (
    <FormControl sx={{ display: "flex"}}>
      <FormLabel sx={{marginLeft: "10px"}}>LinePlot options:</FormLabel>
      <RadioGroup
        name="Lineplotconfig-radio-buttons-group"
        value={configValue}
        onChange={handleChange}
        sx={{marginLeft: "10px"}}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
