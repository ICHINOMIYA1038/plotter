import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document"
import Text from "@tiptap/extension-text"
import React, { useRef, useState } from "react";
import History from "@tiptap/extension-history"

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
import HowToSlideShow from "../HowToSlideShow";
import { DraggableParagraph } from "../DraggableParagraph";
import { DraggableHeading } from "../DraggableHeading";

// utils/saveJSONToS3.ts
export async function saveJSONToS3({ oid, content }: { oid: string; content: string }) {
  if (!oid || !content) {
    throw new Error('Both oid and content are required');
  }

  try {
    const response = await fetch('/api/s3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oid, content }),
    });

    const textResponse = await response.text(); // Read the response as text
    if(textResponse=="Data saved successfully"){
      console.log("保存に成功しました")
    }
  } catch (error) {
    console.error('Error saving data to S3:', error);
    throw error;
  }
}

export default function Editor({ oid, initialContent }: any) {
  const [selectionNode, setSelectionNode] = useState<any>(null); // 選択中のノードを一時的に保持するための状態
  const [toc, setToc] = useState([]);
  const parentDivRef = useRef(null);
  const [characterList, setCharacterList] = useState([]);
  const [speakerinput, setSpeakerInput] = useState("");
  const [flashMessage, setFlashMessage] = useState('');
  const [dummy, setDummy] = useState([]);

  const saveContentAsJSON = (editor: any) => {
    try {
      const content = editor.getJSON();
      localStorage.setItem("editor-json-content", JSON.stringify(content));
      return { success: true };  // 成功した場合は success: true を返す
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
      setFlashMessage(error as string);  // エラーメッセージを設定
      setTimeout(() => setFlashMessage(''), 3000);
      return { success: false, error: error };  // エラーが発生した場合は success: false とエラー情報を返す
    }
  };

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

  const editor = useEditor({
    extensions: [
      Document,
      Bold,
      Strike,
      Italic,
      Text,
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
      History,
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
    onUpdate: async ({ editor }: any) => {
      updateToc();
      saveContentAsJSON(editor);

      setCharacterList(getCharacterList(editor));
      try {
        await saveJSONToS3({
          oid, // Pass the oid here
          content: editor.getHTML(),
        });
        console.log("Content saved to S3 successfully");
      } catch (error) {
        console.error("Error saving content to S3:", error);
      }
    },
    content: initialContent,
    onBlur: ({ editor }: any) => {
      // なぜかonBluerの中身が存在しないとバブルメニューが動かないので、ダミーの関数を入れている。
      setDummy(editor.getHTML())
    },
  });

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-hidden overflow-y-scroll">
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
            <Toolbar editor={editor} />
          </div>
          {flashMessage && (
            <div className="flash-message absolute top-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">エラー!</strong>
              <span className="block sm:inline pl-6">{flashMessage}</span>
            </div>
          )}
          <EditorContent editor={editor} className="w-full h-85vh" />
        </div>
        <div className="col-span-2 h-full">
          <div className=" overflow-y-scroll h-45vh">
            {" "}
            {editor && <TOC editor={editor} />}
          </div>
          <div className=" overflow-y-scroll h-45vh">
            {" "}
            <Sidebar node={selectionNode} editor={editor} />
          </div>
        </div>
      </div>
      <CustomBubbleMenu
        editor={editor}
        characterList={characterList}
        speakerinput={speakerinput}
      />
    </div>
  );
}
