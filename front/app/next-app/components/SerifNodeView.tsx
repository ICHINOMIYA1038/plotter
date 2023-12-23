import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

export function SerifNodeView({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="serif">
      <NodeViewContent as="div" className="serif-content" />
    </NodeViewWrapper>
  );
}
