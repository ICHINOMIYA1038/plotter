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
import HardBreak from "@tiptap/extension-hard-break";
import EditorToJSON from "../EditorToJson";
import JSONToEditor from "../JSONtoEditor";
import Sidebar from "../Sidebar";
import { TOC } from "../Toc";
import { Toolbar } from "../Toolbar";
import { SettingSidebar } from "../SettingSideBar";
import { CustomKeyBoardShortcuts } from "../CustomKeyBoardShortcuts";
import { CustomBubbleMenu } from '../CustomBubbleMenu';
import { getCharacterList } from "../getCharacterList";
import { CharacterDetail, CharacterItem, CharacterName, Characters } from "../CharactersNode";
import { customPlaceholder } from "../CustomPlaceholder";
import PDFTEST from "../PDFTEST";

const saveContentAsJSON = (editor) => {
  const content = editor.getJSON();
  localStorage.setItem("editor-json-content", JSON.stringify(content));
};

// JSON形式での読み込み
const loadContentFromJSON = () => {
  const content = localStorage.getItem("editor-json-content");
  return content ? JSON.parse(content) : null;
};

export default function TipTap({ setData, data, setContent }: any) {
  const [selectionNode, setSelectionNode] = useState<any>(null); // 選択中のノードを一時的に保持するための状態
  const [toc, setToc] = useState([]);
  const parentDivRef = useRef(null);
  const [characterList, setCharacterList] = useState([]);
  const [speakerinput, setSpeakerInput] = useState("");
  const [initialContent, setInitialContent] = useState(() => {
    if (typeof window !== "undefined") {
      return loadContentFromJSON();
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
      Characters,
      CharacterItem,
      CharacterName,
      CharacterDetail,
      TextStyle,
      Color,
      Serif,
      SpeechContent,
      Speaker,
      Link,
      Highlight.configure({ multicolor: true }),
      Underline,
      CustomKeyBoardShortcuts,
      HardBreak.configure({
        keepMarks: true,
      }),
      Placeholder.configure({
        placeholder: "ブロックを選択するかテキストを入力",
        showOnlyCurrent: false,
        includeChildren: true
      })
    ],
    onSelectionUpdate(props) {
      console.log("selection update")
      const { selection } = props.editor.state;
      const { from, to } = selection;
      let node = selection.$from.node(1);
      if (node) {
        // 最上位の親ノードを取得
        setSelectionNode(node);
        if (selection.$anchor.parent.type.name === 'speaker') {
          setSpeakerInput(selection.$anchor.parent.textContent)
        }
      } else {
        setSelectionNode(null);
      }
    },
    onUpdate: ({ editor }) => {
      updateToc();
      saveContentAsJSON(editor);
      if (typeof window !== "undefined") {
        localStorage.setItem("editor-content", editor.getHTML());
      }
      setCharacterList(getCharacterList(editor));
    },
    content: initialContent,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
  });

  if (!editor) {
    return null;
  }



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
          <EditorContent editor={editor} ref={parentDivRef} className="w-full h-85vh" />
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
      <CustomBubbleMenu editor={editor} characterList={characterList} speakerinput={speakerinput} />
      {false && (
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
                editor.chain().focus().setParagraph().unsetAllMarks().run()
              }
            >
              標準
            </button>
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
              onClick={() => {
                // エディタの現在の選択を取得
                const { from } = editor.state.selection;

                // カーソル位置を行の始まりに移動
                editor.chain().focus().setTextSelection(from - 1).run();

                // '登場人物'と3つのリストアイテムを挿入
                editor.chain().insertContent('<h5>登場人物</h5><ul><li>名前1</li><li>名前2</li><li>名前3</li></ul>').run();
              }}
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
<h1>嗚呼あああ</h1><h2>嗚呼あああ嗚呼</h2><div class="serif"><p class="speaker">話者会話内容あaaaaaae</p><p class="speechContent">h</p></div><h3>a嗚呼嗚呼</h3><div class="characters"><h5>登場人物</h5><div class="characterItem"><p class="characterName">人物名1人物詳細1aaaaaaaaaddddddddddd</p><p class="characterDetail"></p></div></div><h2><strong><em>あaa</em></strong></h2><h1>aaaaa</h1>
`;

