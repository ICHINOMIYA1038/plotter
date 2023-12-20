import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useState } from "react";
import { Node } from "@tiptap/core";
import { paginationPlugin } from "prosemirror-pagination";

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

const MAX_WIDTH = 1000; // 最大横幅

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
    content: content,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
    editorProps: {
      plugins: [
        paginationPlugin({
          /* ページネーションの設定 */
        }),
      ],
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
<div class="page"><h2>タイトル</h2><p>おはようございます。</p><p>テスト</p></div>
<div class="page"></div>
`;
