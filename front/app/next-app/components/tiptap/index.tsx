import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { Node } from "@tiptap/core";
import { SketchPicker } from "react-color";
import TextStyle from "@tiptap/extension-text-style";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { Underline } from "@tiptap/extension-underline";

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

export default function TipTap({ setData, data, setContent }: any) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
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
      TextStyle,
      Color,
      Link,
      Highlight,
      PageNode,
      Underline,
    ],
    onUpdate: ({ editor }) => {},
    content: content,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
  });

  const [menu, setMenu] = useState("main"); // 'main', 'decoration', 'heading', 'pageBreak'

  if (!editor) {
    return null;
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-w-xl min-h-xl mx-auto"
      />
      {showSlashMenu && (
        <div className="slash-menu">
          {" "}
          <button>見出し1</button>
          <button>見出し2</button>
        </div>
      )}
      <BubbleMenu editor={editor} tippyOptions={{ placement: "right" }}>
        {menu === "main" && (
          <div className="flex flex-col">
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => setMenu("decoration")}
            >
              装飾
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => setMenu("heading")}
            >
              見出し・段落
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.commands.insertContent("<hr>")}
            >
              改ページ
            </button>
          </div>
        )}
        {/* 装飾サブメニュー */}
        {menu === "decoration" && (
          <div className="flex flex-col">
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              Bold
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              Italic
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              Underline
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              Strikethrough
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => setMenu("main")}
            >
              戻る
            </button>
          </div>
        )}

        {/* 見出し・段落サブメニュー */}
        {menu === "heading" && (
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                key={level}
                onClick={() =>
                  editor.chain().focus().setHeading({ level }).run()
                }
              >
                見出し{level}
              </button>
            ))}
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().setParagraph().run()}
            >
              段落
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => setMenu("main")}
            >
              戻る
            </button>
          </div>
        )}
      </BubbleMenu>
    </div>
  );
}

const content = `
<h2>ページ1</h2><p>おはようございます。</p><p>テスト</p>
<h2>ページ2</h2><p>おはようございます。</p>
`;

const Toolbar = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#000000");
  const pickerRef = useRef();

  if (!editor) {
    return null;
  }

  const handleColorChange = (color) => {
    setColor(color.hex);
    editor.chain().focus().setMark("textStyle", { color: color.hex }).run();
  };

  const isActive = (format) => {
    return editor.isActive(format);
  };

  return (
    <div className="flex gap-2 p-2 border-b border-gray-300">
      {/* Bold Button */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn ${editor.isActive("bold") ? "btn-active" : ""}`}
      >
        Bold
      </button>

      {/* Strike Button */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`btn ${editor.isActive("strike") ? "btn-active" : ""}`}
      >
        Strike
      </button>

      {/* Link Button */}
      <button
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("URL");
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`btn ${editor.isActive("link") ? "btn-active" : ""}`}
      >
        Link
      </button>

      {/* Undo Button */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={`btn ${editor.can().undo() ? "btn-active" : ""}`}
      >
        Undo
      </button>

      {/* Redo Button */}
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={`btn ${editor.can().redo() ? "btn-active" : ""}`}
      >
        Redo
      </button>

      {/* カラーピッカートリガーボタン */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`btn ${showColorPicker ? "btn-active" : ""}`}
        >
          Color
        </button>
        {/* カラーピッカー */}
        {showColorPicker && (
          <div className="absolute right-0 z-10">
            <SketchPicker
              color={color}
              onChangeComplete={(color) => {
                setColor(color.hex);
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { color: color.hex })
                  .run();
              }}
            />
            <button onClick={() => setShowColorPicker(false)} className="btn">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
