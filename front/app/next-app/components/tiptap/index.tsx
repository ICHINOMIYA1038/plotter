import { EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React, { useEffect, createContext, useRef, useState } from "react";

import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import { Serif, Speaker, SpeechContent } from "../SerifNode";
import HardBreak from "@tiptap/extension-hard-break";
import Sidebar from "../Sidebar";
import { TOC } from "../Toc";
import { Toolbar } from "../Toolbar";
import { SettingSidebar } from "../SettingSideBar";
import { CustomKeyBoardShortcuts } from "../CustomKeyBoardShortcuts";
import { CustomBubbleMenu } from "../CustomBubbleMenu";
import { getCharacterList } from "../getCharacterList";
import {
  CharacterDetail,
  CharacterItem,
  CharacterName,
  Characters,
} from "../CharactersNode";
import { Header } from "../Header";
import HowToSlideShow from "../HowToSlideShow";
import { DraggableParagraph } from "../DraggableParagraph";
import { DraggableHeading } from "../DraggableHeading";

const saveContentAsJSON = (editor: any) => {
  const content = editor.getJSON();
  localStorage.setItem("editor-json-content", JSON.stringify(content));
};

// JSON形式での読み込み
const loadContentFromJSON = () => {
  const content = localStorage.getItem("editor-json-content");
  return content ? JSON.parse(content) : null;
};

export const RefContext = createContext(null);

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

    console.log(editor?.getHTML())

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
      DraggableParagraph,
      DraggableHeading,
      TextStyle,
      Color,
      Serif,
      SpeechContent,
      Speaker,
      Link,
      Highlight.configure({ multicolor: true }),
      Underline,
      CustomKeyBoardShortcuts(parentDivRef),
      HardBreak.configure({
        keepMarks: true,
      }),
      Placeholder.configure({
        placeholder: "ブロックを選択するかテキストを入力",
        showOnlyCurrent: false,
        includeChildren: true,
      }),
    ],
    onSelectionUpdate(props) {
      const { selection } = props.editor.state;
      const { from, to } = selection;
      let node = selection.$from.node(1);
      if (node) {
        // 最上位の親ノードを取得
        setSelectionNode(node);
        if (selection.$anchor.parent.type.name === "speaker") {
          setSpeakerInput(selection.$anchor.parent.textContent);
        }
      } else {
        setSelectionNode(null);
      }
    },
    onUpdate: ({ editor }: any) => {
      updateToc();
      saveContentAsJSON(editor);

      setCharacterList(getCharacterList(editor));
    },
    content: content,
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
          <HowToSlideShow />
        </div>
        <div
          className="col-span-8 p-4 min-w-full max-w-full h-full mx-auto overflow-auto"
          ref={parentDivRef}
        >
          <div className="h-15vh xl:flex">
            <Header />
            <Toolbar editor={editor} />
          </div>
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
      <CustomBubbleMenu
        editor={editor}
        characterList={characterList}
        speakerinput={speakerinput}
      />
      {false && (
        <FloatingMenu
          editor={editor!}
          tippyOptions={{
            offset: [0, 50],
          }}
        >
          <div className="flex flex-col">
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor?.chain().focus().setParagraph().unsetAllMarks().run()
              }
            >
              標準
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              タイトル
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              シーン
            </button>
            <button className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg">
              セリフ
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              ト書き
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              作者
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
              onClick={() => {
                // エディタの現在の選択を取得
                const { from } = editor?.state.selection!;

                // カーソル位置を行の始まりに移動
                editor
                  ?.chain()
                  .focus()
                  .setTextSelection(from - 1)
                  .run();

                // '登場人物'と3つのリストアイテムを挿入
                editor
                  ?.chain()
                  .insertContent(
                    "<h5>登場人物</h5><ul><li>名前1</li><li>名前2</li><li>名前3</li></ul>"
                  )
                  .run();
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

      `;
