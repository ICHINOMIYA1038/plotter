import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Node } from "@tiptap/react";
import { exportToPDF } from "../htmlToPdf";

export const TOC = ({ editor }: any) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const doc = editor.state.doc;
      let headingNodes: any = [];
      doc.forEach((node: any, pos: any) => {
        if (node.type.name === "heading") {
          headingNodes.push({
            id: pos,
            text: node.textContent,
            level: node.attrs.level,
          });
        }
      });
      setHeadings(headingNodes);
    };

    updateHeadings();
    editor.on("update", updateHeadings);

    return () => {
      editor.off("update", updateHeadings);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="toc max-h-64 overflow-y-auto bg-white shadow-lg border border-gray-200 p-4 mb-6">
      <ul className="list-none">
        {headings.map((heading: any) => (
          <li
            key={heading.id}
            className={`mb-2 ${
              heading.level === 1 ? "text-lg font-bold" : "text-base"
            }`}
          >
            <a
              href={`#heading-${heading.id}`}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
              onClick={() =>
                editor.chain().focus().setTextSelection(heading.id).run()
              }
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          exportToPDF(editor);
        }}
      >
        PDFをダウンロード
      </button>
    </div>
  );
};
