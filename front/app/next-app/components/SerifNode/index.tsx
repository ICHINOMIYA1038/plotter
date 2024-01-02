import { Node } from "@tiptap/core";

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
});

export const Speaker = Node.create({
  name: "speaker",

  content: "inline*",

  group: "block",

  parseHTML() {
    return [
      {
        tag: "p.speaker", // `p` タグに `customClass` クラスが適用されているものを対象とします
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, class: "speaker" }, 0];
  },
});

export const SpeechContent = Node.create({
  name: "speechContent",

  content: "inline*",

  group: "block",

  parseHTML() {
    return [
      {
        tag: "p.speechContent", // `p` タグに `customClass` クラスが適用されているものを対象とします
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, class: "speechContent" }, 0];
  },
});
