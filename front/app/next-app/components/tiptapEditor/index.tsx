import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RichEditorToolbar from "@/components/tiptapEditor/toolbar";

const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class: "prose prose-base m-5 focus:outline-none text-left",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-2/3 mt-10 mx-auto border-gray-500 border-2">
        <RichEditorToolbar editor={editor} />
        <div className="p-3 overflow-y-scroll h-[70vh] overflow-hidden mt-3">
            <EditorContent editor={editor} />
        </div>
    </div>
  );
};

export default TipTapEditor;