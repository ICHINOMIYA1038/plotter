import { useState } from "react";
import BasicEditor from "@/components/BasicEditor";
import BreakEditor from "@/components/BreakEditor";

function App() {
  const [data, setData] = useState({
    title: "",
    tags: [],
    date: new Date().toLocaleDateString(),
  });

  const [content, setContent] = useState({
    content: "",
  });

  return (
    <div className="App">
      <div className="p-4 mx-auto">
        <BreakEditor setData={setData} data={data} setContent={setContent} />
      </div>
    </div>
  );
}

export default App;
