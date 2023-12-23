import { Node, mergeAttributes } from "@tiptap/core";

export const SerifNode = Node.create({
  name: "serifNode",

  // スキーマの定義
  content: "inline*",
  group: "block",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addCommands() {
    return {
      setParagraph:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  // HTMLへのレンダリング方法
  parseHTML() {
    return [
      {
        tag: "div.serif",
      },
    ];
  },

  // ProseMirrorノードへの変換方法
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { class: "serif" },
      ["div", { class: "speaker" }, "話者名"],
      ["div", { class: "speechContent" }, "発言"],
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph(),
    };
  },
});
