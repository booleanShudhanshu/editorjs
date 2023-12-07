import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  SelectionState,
  contentState,
  Modifier,
} from "draft-js";
import Toolbar from "./Toolbar/toolbar";
import "./App.css";

const DraftEditor = () => {
  const [curPosition, setCurrPosition] = useState({
    block_key: "",
    cursorPosition: 0,
  });
  const [openMenu, setOpenMenu] = useState(false);
  const [cord, setCord] = useState({
    top: 0,
    left: 0,
  });
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: "3eesq",
            text: "A Text-editor with super cool features built in Draft.js.",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 19,
                length: 6,
                style: "BOLD",
              },
              {
                offset: 25,
                length: 5,
                style: "ITALIC",
              },
              {
                offset: 30,
                length: 8,
                style: "UNDERLINE",
              },
            ],
            entityRanges: [],
            data: {},
          },
          {
            key: "9adb5",
            text: "Tell us a story!",
            type: "header-one",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      })
    )
  );
  const editor = useRef(null);

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    editor.current.focus();
  };

  const handleKeyCommand = (command) => {
    console.log(editorState, command, "editorState, command");
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    // Get the current SelectionState

    return false;
  };
  const handleKeyPress = (e) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const text = currentBlock.getText();
    const cursorPosition = selectionState.getAnchorOffset();
    if (e === "{" && text.charAt(cursorPosition - 1) === "{") {
      setOpenMenu(true);
    } else {
      setOpenMenu(false);
    }
  };
  useEffect(() => {
    const selection = editorState.getSelection();
    const cursorPosition = selection.getAnchorOffset();
    const block_key = selection.getAnchorKey();
    const selectedBlock = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getAnchorKey());
    const selectedBlockNode = document.querySelector(
      `[data-offset-key="${selectedBlock.getKey()}-0-0"]`
    );

    if (selectedBlockNode) {
      const editorContainer = document.querySelector(".editor-container");
      const cursorRect = selectedBlockNode.getBoundingClientRect();
      const editorRect = editorContainer.getBoundingClientRect();
      console.log(cursorRect, editorRect);
      const top = cursorRect.top - editorRect.top + window.scrollY;
      const left = cursorRect.left - editorRect.left + window.scrollX;
      setCord({ top, left });
    }

    setCurrPosition({
      block_key,
      cursorPosition,
    });
  }, [editorState]);
  // FOR INLINE STYLES
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        break;
    }
  };
  const addVariable = (newContent = "hsjkhjksh") => {
    if (curPosition.block_key) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const cursorPosition = selectionState.getAnchorOffset();
      const blockKey = curPosition.block_key;
      const blockMap = contentState.getBlockMap();
      const selectedBlock = blockMap.get(blockKey);
      const inlineStyleRanges = selectedBlock.getInlineStyleAt(cursorPosition);
      const updatedText = newContent + "}}";
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState,
        updatedText,
        inlineStyleRanges
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "insert-characters"
      );
      const newSelection = selectionState.merge({
        anchorOffset: cursorPosition + newContent.length,
        focusOffset: cursorPosition + newContent.length,
      });
      const finalEditorState = EditorState.acceptSelection(
        newEditorState,
        newSelection
      );

      setEditorState(finalEditorState);
    }
    setCord({ top: 0, left: 0 });
    setOpenMenu(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="editor-wrapper" onClick={focusEditor}>
        <div className="editor-container">
          <Editor
            ref={editor}
            placeholder="Let fix this"
            handleKeyCommand={handleKeyCommand}
            editorState={editorState}
            customStyleMap={styleMap}
            blockStyleFn={myBlockStyleFn}
            onChange={(editorState) => {
              const contentState = editorState.getCurrentContent();
              console.log(
                convertToRaw(contentState),
                contentState,
                "contentState"
              );
              setEditorState(editorState);
            }}
            handleBeforeInput={handleKeyPress}
          />
        </div>
        <Toolbar editorState={editorState} setEditorState={setEditorState} />
      </div>{" "}
      {openMenu ? (
        <div
          style={{
            position: "absolute",
            top: cord.top + "px",
            left: cord.left + "px",
            padding: "10px",
            border: "1px ridge",
            background: "white",
          }}
        >
          <ul style={{ position: "relative", zIndex: 2000 }}>
            {["var1", "var2", "var3"].map((el) => (
              <li key={el} onClick={() => addVariable(el)}>
                {el}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DraftEditor;
