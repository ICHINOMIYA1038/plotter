import {
  BubbleMenu,
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
import { SketchPicker } from "react-color";
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
import { TextSelection } from "@tiptap/pm/state";

export default function TipTap({ setData, data, setContent }: any) {
  const [jsonContent, setJsonContent] = useState(null); // JSON データを一時的に保持するための状態
  const [selectionNode, setSelectionNode] = useState(null); // 選択中のノードを一時的に保持するための状態
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

    const newToc = [];
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

  function getTopLevelParent(node, doc) {
    let parent = node;
    doc.descendants((childNode, pos, parentNode) => {
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
      DisableShiftEnterExtension,
      Underline,
      HardBreak.configure({
        keepMarks: true,
      }),
      Placeholder.configure({
        placeholder: "Write something …",
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
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "話者名" }],
                },
              ],
            },
            {
              type: "speechContent",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "会話内容" }],
                },
              ],
            },
          ],
        })
        .run();
    }
  };

  const handleHeadingClick = (headingId) => {
    if (!editor || !editor.state) return;

    const { doc } = editor.state;
    let targetPos = null;

    // ドキュメントを走査して、クリックされた見出しの位置を見つける
    doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const id = `heading-${pos}`;
        if (id === headingId) {
          targetPos = pos;
          return false; // 見つけたら走査を中止
        }
      }
    });

    if (targetPos !== null) {
      // エディタのカーソルを見出しの位置に設定
      editor.view.dispatch(
        editor.state.tr.setSelection(
          TextSelection.near(editor.state.doc.resolve(targetPos))
        )
      );
      editor.view.focus();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonContent(JSON.parse(e.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleLoadContent = () => {
    if (jsonContent) {
      JSONToEditor(editor, jsonContent);
    } else {
      alert("JSON ファイルを選択してください。");
    }
  };

  return (
    <div>
      {editor && <TOC editor={editor} />}
      <Sidebar node={selectionNode} editor={editor} />
      <Toolbar editor={editor} />
      <button
        onClick={() => EditorToJSON(editor)}
        className="bg-blue-500 text-white p-2 rounded"
      >
        JSON として出力
      </button>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleLoadContent}
        className="bg-blue-500 text-white p-2 rounded"
      >
        入力
      </button>

      <EditorContent
        editor={editor}
        className="p-4 min-w-xl min-h-xl mx-auto"
      />
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
              ト書き
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
                editor.chain().focus().toggleHeading({ level: 6 }).run()
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
