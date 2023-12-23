import Paragraph from "@tiptap/extension-paragraph";
import {
  mergeAttributes,
  ReactNodeViewRenderer,
  NodeViewContent,
  NodeViewWrapper,
} from "@tiptap/react";
import { Box } from "@kuma-ui/core";

import { FaGripHorizontal } from "react-icons/fa";

function DraggableParagraphNode() {
  return (
    <NodeViewWrapper data-drag-handle>
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
