import React from "react";

export const VariableDropdown = ({ onSelect, position }) => {
  const variables = ["variable1", "variable2", "variable3"]; // Define your variable options

  const dropdownStyle = {
    position: "absolute",
    top: position.top + 10 + "px",
    left: position.left + "px",
    border: "1px ridge",
  };

  return (
    <div className="variable-dropdown" style={dropdownStyle}>
      <ul style={{ background: "white", zIndex: 2000, position: "relative" }}>
        {variables.map((variable, index) => (
          <li key={index} onClick={() => onSelect(variable)}>
            {variable}
          </li>
        ))}
      </ul>
    </div>
  );
};
