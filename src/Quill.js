import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MyEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const [isVariableDropdownVisible, setVariableDropdownVisible] =
    useState(false);
  const [cursorIndex, setCursorIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ script: "sub" }, { script: "super" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Function to handle text input in the editor
  const handleTextInput = (text, e) => {
    if (text === "{{" && cursorIndex !== null) {
      setVariableDropdownVisible(true);
    }
  };

  // Function to handle variable selection from the dropdown
  const handleVariableSelection = (variable) => {
    if (cursorIndex !== null) {
      let updatedEditorHtml = editorHtml;
      const quill = quillRef.current.getEditor();
      if (cursorIndex > 1) {
        setEditorHtml(
          insertTextAfterSpecificChars(
            updatedEditorHtml,
            `{{${variable}}}`,
            cursorIndex
          )
        );
        setVariableDropdownVisible(false);
      }
    }
  };
  function insertTextAfterSpecificChars(html, textToInsert, curPos) {
    let charCount = 0;
    let resultHtml = "";
    let insideTag = false;

    for (let i = 0; i < html.length; i++) {
      const char = html[i];
      if (char === "<") {
        insideTag = true;
      } else if (char === ">") {
        insideTag = false;
      }

      if (!insideTag) {
        charCount++;
        if (charCount === curPos) {
          resultHtml += textToInsert;
          charCount = 0;
        }
      }

      resultHtml += char;
    }

    return resultHtml;
  }

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        const cursorPos = quill.getSelection().index;
        console.log(quill);
        setCursorIndex(cursorPos);
        if (cursorPos > 0) {
          const prevChar = quill.getText(cursorPos - 2, 2);

          if (prevChar === "{{") {
            // Opening curly brace detected, show the variable dropdown
            setVariableDropdownVisible(true);

            // Calculate the position for the dropdown
            const quillBounds = quill.container.getBoundingClientRect();
            const cursorBounds = quill.getBounds(cursorPos);

            const top = cursorBounds.bottom + window.scrollY;
            const left = cursorBounds.left + window.scrollX;

            setDropdownPosition({ top, left });
          } else {
            setVariableDropdownVisible(false);
          }
        }
      }
    });
  }, [editorHtml]);
  console.log(editorHtml, "editorHtml");
  const quillRef = React.createRef();

  return (
    <div style={{ position: "relative" }}>
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={setEditorHtml}
        onKeyPress={(e) => handleTextInput(e.key, e)}
        modules={modules}
        formats={formats}
      />
      {isVariableDropdownVisible && (
        <VariableDropdown
          onSelect={handleVariableSelection}
          position={dropdownPosition}
        />
      )}
    </div>
  );
};

const VariableDropdown = ({ onSelect, position }) => {
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

export default MyEditor;
