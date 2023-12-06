import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = () => {
  const [text, setText] = useState("");
  const quillRef = useRef(null);
  const [variables, setVariables] = useState(["variable1", "variable2"]);

  const handleVariableInsert = (variable) => {
    const quill = quillRef.current.getEditor();
    const selection = quill.getSelection();
    if (selection) {
      quill.insertText(selection.index, `{{${variable}}}`);
    }
  };

  const handleTextChange = (value) => {
    setText(value);
  };

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["variable1", "variable2"],
      ],
      handlers: {
        variable1: () => handleVariableInsert("variable1"),
        variable2: () => handleVariableInsert("variable2"),
      },
    },
  };

  return (
    <div>
      <button onClick={() => handleVariableInsert("variable1")}>
        Insert Variable 1
      </button>
      <button onClick={() => handleVariableInsert("variable2")}>
        Insert Variable 2
      </button>
      <ReactQuill
        ref={quillRef}
        value={text}
        onChange={handleTextChange}
        modules={modules}
      />
    </div>
  );
};

export default RichTextEditor;
