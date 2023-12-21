import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { Link } from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { Node } from "@tiptap/core";
import { SketchPicker } from 'react-color';
import TextStyle from '@tiptap/extension-text-style';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import {Underline} from '@tiptap/extension-underline'

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
    onUpdate: ({ editor }) => {
      // 文字が入力されるたびに実行される
      const html = editor.getHTML(); // 現在のHTMLを取得
      console.log(html); // コンソールにHTMLを表示
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
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-w-xl min-h-xl mx-auto"
      />
<BubbleMenu editor={editor} tippyOptions={{ placement: 'right' }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline />
        </button>
        {/* その他のメニューアイテム */}
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
  const [color, setColor] = useState('#000000');
  const pickerRef = useRef();

  
  if (!editor) {
    return null;
  }


  const handleColorChange = (color) => {
    setColor(color.hex);
    editor.chain().focus().setMark('textStyle', { color: color.hex }).run();
  };

  const isActive = (format) => {
    return editor.isActive(format);
  };

  return (
    <div className="flex gap-2 p-2 border-b border-gray-300">
      {/* Bold Button */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`btn ${editor.isActive('bold') ? 'btn-active' : ''}`}
      >
        Bold
      </button>

      {/* Strike Button */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`btn ${editor.isActive('strike') ? 'btn-active' : ''}`}
      >
        Strike
      </button>

      {/* Link Button */}
      <button
        onClick={() => {
          if(editor.isActive('link')){
            editor.chain().focus().unsetLink().run()
          }else{
            const url = window.prompt('URL');
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`btn ${editor.isActive('link') ? 'btn-active' : ''}`}
      >
        Link
      </button>

      {/* Undo Button */}
      <button onClick={() => editor.chain().focus().undo().run()} className={`btn ${editor.can().undo()
 ? 'btn-active' : ''}`}>
        Undo
      </button>

      {/* Redo Button */}
      <button onClick={() => editor.chain().focus().redo().run()} className={`btn ${editor.can().redo()
 ? 'btn-active' : ''}`}>
        Redo
      </button>

       {/* カラーピッカートリガーボタン */}
       <div className="relative">
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className={`btn ${showColorPicker ? 'btn-active' : ''}`}
      >
        Color
      </button>
       {/* カラーピッカー */}
       {showColorPicker && (
        <div className="absolute right-0 z-10">
          <SketchPicker color={color} onChangeComplete={(color) => {
            setColor(color.hex);
            editor.chain().focus().setMark('textStyle', { color: color.hex }).run();
          }} />
          <button onClick={() => setShowColorPicker(false)} className="btn">
            Close
          </button>
        </div>
      )}
      </div>
    </div>
  );
};
