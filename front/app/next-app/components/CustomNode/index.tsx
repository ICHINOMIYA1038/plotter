import { Node, mergeAttributes } from "@tiptap/react";

export default Node.create({
  name: "customNode",

  // ノードのHTML表現を定義
  group: "block",
  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "div.serif",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { class: "serif" }), 0];
  },
});
