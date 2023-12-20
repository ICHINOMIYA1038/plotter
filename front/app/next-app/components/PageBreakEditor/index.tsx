import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useState } from "react";
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

const MAX_HEIGHT = 300; // ページの最大高さ

const createPaginatedDOM = (htmlDOM: string) => {
  const container = document.createElement("div");
  container.innerHTML = htmlDOM;

  let currentPage = document.createElement("div");
  currentPage.className = "page";

  const pages = [];
  let currentHeight = 0;

  Array.from(container.childNodes).forEach((node) => {
    const clone = node.cloneNode(true) as HTMLElement;
    currentPage.appendChild(clone);
    currentHeight += clone.offsetHeight;

    if (currentHeight >= MAX_HEIGHT) {
      pages.push(currentPage.outerHTML);
      currentPage = document.createElement("div");
      currentPage.className = "page";
      currentHeight = 0;
    }
  });

  if (currentPage.childNodes.length > 0) {
    pages.push(currentPage.outerHTML);
  }

  console.log(pages.join(""));

  return pages.join("");
};

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
      console.log(html); // コンソールにHTMLを表示
      createPaginatedDOM(html);
    },
    content: content,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
  });

  return (
    <div>
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
