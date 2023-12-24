import Paragraph from "@tiptap/extension-paragraph";
import {
  mergeAttributes,
  ReactNodeViewRenderer,
  NodeViewContent,
  NodeViewWrapper,
} from "@tiptap/react";
import { Box } from "@kuma-ui/core";

import { FaGripHorizontal } from "react-icons/fa";
import { useEffect, useState } from "react";

function DraggableParagraphNode(props: any) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { node, editor } = props;

  const handleFocus = () => {
    console.log(editor.state);
    setMenuVisible(true);
  };

  const handleBlur = () => {
    setMenuVisible(false);
  };

  const handleChangeType = (newType: any, level = 1) => {
    // ノードタイプを更新するロジック
    const attrs = newType === "heading" ? { level } : {};
    editor.chain().focus().setNode(newType, attrs).run();
  };

  useEffect(() => {
    const updateMenuVisibility = () => {
      const { from, to } = editor.state.selection;
      let currentNode = props.editor.state.doc.nodeAt(to);
      if (editor.state.selection.empty) {
        currentNode = props.editor.state.doc.nodeAt(to - 1);
      }
      //console.log(props.node);
      console.log(currentNode);
      console.log(props.node.content.content[0]);
      if (currentNode === props.node.content.content[0]) setMenuVisible(true);
      else setMenuVisible(false);
    };

    editor.on("selectionUpdate", updateMenuVisibility);

    return () => {
      editor.off("selectionUpdate", updateMenuVisibility);
    };
  }, [editor]);

  return (
    <NodeViewWrapper data-drag-handle>
      {menuVisible && (
        <div className="node-menu">
          <button onClick={() => handleChangeType("heading", 6)}>作者名</button>
          <button onClick={() => handleChangeType("heading", 2)}>
            タイトル
          </button>
        </div>
      )}
      <Box
        draggable="true"
        p={8}
        pt={6}
        display="flex"
        alignItems="center"
        cursor="pointer"
      >
        <FaGripHorizontal size="16" />
        <NodeViewContent className="content" />
      </Box>
    </NodeViewWrapper>
  );
}

export const DraggableParagraph = Paragraph.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(DraggableParagraphNode);
  },
});
