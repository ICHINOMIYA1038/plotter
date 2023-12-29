import {
  BubbleMenu,
  Editor,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { Underline } from "@tiptap/extension-underline";
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import { Serif, Speaker, SpeechContent } from "../SerifNode";
import { DraggableParagraph } from "../DraggableParagraph";
import { DisableShiftEnterExtension } from "../DisableShiftEnterExtension";
import HardBreak from "@tiptap/extension-hard-break";
import EditorToJSON from "../EditorToJson";
import JSONToEditor from "../JSONtoEditor";
import Sidebar from "../Sidebar";
import { TOC } from "../Toc";
import { Toolbar } from "../Toolbar";
import { SettingSidebar } from "../SettingSideBar";
import { CustomKeyBoardShortcuts } from "../CustomKeyBoardShortcuts";

export default function TipTap({ setData, data, setContent }: any) {
  const [selectionNode, setSelectionNode] = useState<any>(null); // 選択中のノードを一時的に保持するための状態
  const [toc, setToc] = useState([]);
  const [initialContent, setInitialContent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("editor-content") || content;
    } else {
      return content;
    }
  });

  const updateToc = () => {
    if (!editor || !editor.state) return;

    const newToc: any = [];
    const { doc } = editor.state;

    doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const level = node.attrs.level;
        const id = `heading-${pos}`; // 一意のIDを生成
        const text = node.textContent;

        newToc.push({ id, level, text });
      }
    });

    setToc(newToc);
  };

  function getTopLevelParent(node: any, doc: any) {
    let parent = node;
    doc.descendants((childNode: any, pos: any, parentNode: any) => {
      if (childNode === node && parentNode && parentNode.type.name !== "doc") {
        parent = parentNode;
      }
    });
    return parent;
  }
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
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      TextStyle,
      Color,
      Serif,
      SpeechContent,
      Speaker,
      Link,
      Highlight,
      Underline,
      CustomKeyBoardShortcuts,
      HardBreak.configure({
        keepMarks: true,
      }),
      Placeholder.configure({
        placeholder: "",
      }),
    ],
    onSelectionUpdate(props) {
      const { selection } = props.editor.state;
      const { from, to } = selection;
      let node = selection.$from.node(1);

      if (node) {
        // 最上位の親ノードを取得
        setSelectionNode(node);
      } else {
        setSelectionNode(null);
      }
    },
    onUpdate: ({ editor }) => {
      updateToc();
      if (typeof window !== "undefined") {
        localStorage.setItem("editor-content", editor.getHTML());
      }
    },
    content: initialContent,
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

  const insertSerifNode = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "serif",
          content: [
            {
              type: "speaker",
              text: "話者名",
            },
            {
              type: "speechContent",
              text: "会話内容",
            },
          ],
        })
        .run();
    }
  };


  return (
    <div>

      <div className="grid grid-cols-12 h-screen w-screen">
        <div className="overflow-y-auto col-span-2">
          {" "}
          {/* 新しいSettingSidebar */}
          <SettingSidebar editor={editor} />
        </div>
        <div className="col-span-8 p-4 min-w-full max-w-full h-full mx-auto overflow-auto">
          <Toolbar editor={editor} />
          <EditorContent editor={editor} className="w-full h-85vh" />
        </div>
        <div className="col-span-2 flex flex-col h-full ">
          <div className="flex-1 overflow-y-scroll">
            {" "}
            {/* TOCのセクション */}
            {editor && <TOC editor={editor} />}
          </div>
          <div className="flex-1 overflow-y-scroll">
            {" "}
            {/* 右側のサイドバーのセクション */}
            <Sidebar node={selectionNode} editor={editor} />
          </div>
        </div>
      </div>
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
            {[1, 2, 3, 4, 5, 6].map((level: any) => (
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
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{
            offset: [0, 50],
          }}
        >
          <div className="flex flex-col">
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              タイトル
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              シーン
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={insertSerifNode}
            >
              セリフ
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              ト書き
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              作者
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              登場人物
            </button>
          </div>
        </FloatingMenu>
      )}
    </div>
  );
}

const content = `
<h2>ページ1</h2>
<ul>
<li>A list item</li>
<li>And another one</li>
</ul>
<p>おはようございます。</p><p>テスト</p>
<h2>ページ2</h2><p>おはようございます。</p>
<div class="serif"><div class="speaker"><p>話者名</p></div><div class="speechcontent"><p>会話内容</p></div></div>
`;

