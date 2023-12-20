import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { Node } from "@tiptap/core";

const PageNode = Node.create({
  name: "page",

  group: "block",
  content: "block+",

  defining: true,

  addAttributes() {
    return {
      // カスタム属性をここに追加できます（必要に応じて）
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitBlock(), // カスタム挙動を追加
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.page",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "page", ...HTMLAttributes }, 0];
  },
});

export default function Home({ setData, data, setContent }: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      PageNode,
    ],
    onUpdate: ({ editor }) => {
      // 文字が入力されるたびに実行される
      const html = editor.getHTML(); // 現在のHTMLを取得
      const children =
        editorContainerRef.current.querySelector(".tiptap").children;
      let heightSum = 0;
      Array.from(children).forEach((child) => {
        heightSum += child.offsetHeight;
      });
      console.log(heightSum);
    },
    content: content,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
  });

  const editorContainerRef = useRef(null);

  const [totalHeight, setTotalHeight] = useState(0);

  // エディタのインスタンスを使用する例
  const logContent = () => {
    if (editorContainerRef.current) {
      console.log(editorContainerRef.current.getHTML());
    }
  };

  return (
    <div ref={editorContainerRef}>
      <EditorContent
        editor={editor}
        className="p-4 min-w-xl min-h-xl mx-auto"
      />
    </div>
  );
}

const content = `
<h2>ページ1</h2><p>おはようございます。</p><p>テスト</p>
<h2>ページ2</h2><p>おはようございます。</p>
`;
