import logo from "./logo.svg";
import "./App.css";
import Quill from "./Quill";
import DraftJs from "./draft";
import MyEditor from "./new";

function App() {
  return (
    <div className="w-100 ">
      {/* <div className="w-50 ">
        <Quill />
      </div> */}

      <div className="w-50 mt-2 ">
        <MyEditor />
      </div>
    </div>
  );
}

export default App;
