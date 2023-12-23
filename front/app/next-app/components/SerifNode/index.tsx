import { Node, mergeAttributes } from "@tiptap/core";

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
