import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

export const TOC = ({ editor }: any) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const doc = editor.state.doc;
      let headingNodes: any = [];
      doc.descendants((node: any, pos: any) => {
        if (
          node.type.name === "heading" &&
          [1, 2, 5].includes(node.attrs.level)
        ) {
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
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 my-4 mx-2">
      <div className="flex items-center mb-4">
        <span className="text-lg font-semibold ">目次</span>
        <FontAwesomeIcon icon={faList} />
      </div>
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
    </div>
  );
};
