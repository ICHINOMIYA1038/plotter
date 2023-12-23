import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { SerifNodeView } from "../SerifNodeView";

export const Serif = Node.create({
  name: "serif",

  group: "block",

  content: "speaker speechContent",

  parseHTML() {
    return [
      {
        tag: "div.serif",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "serif" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => {
        // ここにShift + Enterが押されたときの動作を記述します
        // 例: 現在のカーに改行を挿入
        this.editor.commands.insertContent("<br>");
        return true;
      },
      Enter: () => {
        if (
          this.editor.state.selection.$head.parent.type.name === "speechContent"
        ) {
          this.editor.commands.insertContent("<p></p>");
          return true;
        } else if (
          this.editor.state.selection.$head.parent.type.name === "speaker"
        ) {
          // 次のdivタグにカーソルを移動する
        }
        return false;
      },
    };
  },
});

export const Speaker = Node.create({
  name: "speaker",

  content: "text*",

  parseHTML() {
    return [{ tag: "div", class: "speaker" }];
  },

  renderHTML() {
    return ["div", { class: "speaker" }, 0];
  },
});

export const SpeechContent = Node.create({
  name: "speechContent",

  content: "text*",

  parseHTML() {
    return [{ tag: "div", class: "speechContent" }];
  },

  renderHTML() {
    return ["div", { class: "speechContent" }, 0];
  },
});
