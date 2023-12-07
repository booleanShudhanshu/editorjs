import React, { useState, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const MenuExample = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleWindowClick = (event) => {
    if (
      !event.target.matches(".DraftEditor-root") &&
      !event.target.matches(".menu-container")
    ) {
      closeMenu();
    }
  };

  const handleEditorChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const inputValue = rawContentState.blocks[0].text;

    const index = inputValue.indexOf("{{");
    if (index !== -1) {
      openMenu();
      positionMenu();
    } else {
      closeMenu();
    }

    setEditorState(newEditorState);
  };

  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.display = "block";
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.style.display = "none";
    }
  };

  const selectOption = (option) => {
    const currentValue = editorState.getCurrentContent().getPlainText();
    const modifiedValue = currentValue.replace("{{", "") + option;

    const newEditorState = EditorState.push(
      editorState,
      convertFromRaw({
        blocks: [
          {
            text: modifiedValue,
          },
        ],
        entityMap: {},
      })
    );

    setEditorState(newEditorState);
    closeMenu();
  };

  const positionMenu = () => {
    const selectionRect = window
      .getSelection()
      .getRangeAt(0)
      .getBoundingClientRect();

    setMenuPosition({
      top: selectionRect.bottom + window.scrollY,
      left: selectionRect.left + window.scrollX,
    });
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.key === "Tab") {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        handleEditorChange(newEditorState);
      }
      return;
    }

    return getDefaultKeyBinding(e);
  };

  return (
    <div>
      <label>Type to open menu:</label>
      <div className="menu-container" style={{ position: "relative" }}>
        <div
          ref={menuRef}
          id="menu"
          style={{
            display: "none",
            position: "absolute",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            zIndex: 1,
            top: menuPosition.top + "px",
            left: menuPosition.left + "px",
          }}
        >
          <a href="#" onClick={() => selectOption("apple")}>
            Apple
          </a>
          <a href="#" onClick={() => selectOption("mango")}>
            Mango
          </a>
        </div>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          keyBindingFn={mapKeyToEditorCommand}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};

export default MenuExample;
