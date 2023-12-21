import { Editor as DraftEditor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { useState } from "react";

const Editor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleBold = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  return (
    <div className='m-4 max-w-xl'>
      <div className='mb-1 pr-4 flex items-center'>
        <div className='ml-auto flex items-center space-x-5'>
          <button onClick={handleBold}>B</button>
        </div>
      </div>
      <div className='shadow-sm border border-gray-300 rounded-md sm:text-sm overflow-scroll h-[500px] p-3 prose prose-stone' style={{ writingMode: "vertical-rl" ,textOrientation:"upright"}}>
        <DraftEditor
          editorState={editorState}
          onChange={setEditorState}
          placeholder='Tell a story...'
        />
      </div>
    </div>
  );
};

export default Editor;