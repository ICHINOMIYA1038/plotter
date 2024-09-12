import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document"
import Text from "@tiptap/extension-text"
import React, { useEffect, useRef, useState } from "react";
import History from "@tiptap/extension-history"

import { Link } from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import { Serif, Speaker, SpeechContent } from "../SerifNode";
import HardBreak from "@tiptap/extension-hard-break";
import { CustomKeyBoardShortcuts } from "../CustomKeyBoardShortcuts";
import { CustomBubbleMenu } from "../CustomBubbleMenu";
import { getCharacterList } from "../getCharacterList";
import {
  CharacterDetail,
  CharacterItem,
  CharacterName,
  Characters,
} from "../CharactersNode";
import { DraggableParagraph } from "../DraggableParagraph";
import { DraggableHeading } from "../DraggableHeading";
import { saveContentAsJSON, saveJSONToS3 } from "@/utils/s3/function";
import { useAtom } from "jotai";
import { editorAtom } from "@/atoms/editorAtom";
import { selectionNodeAtom } from "@/atoms/selectionNodeAtom";


export default function EditorMain({ project, initialContent }: any) {
    const [selectionNode, setSelectionNode] = useAtom(selectionNodeAtom);
    const [characterList, setCharacterList] = useState([]);
    const [speakerinput, setSpeakerInput] = useState("");
    const [flashMessage, setFlashMessage] = useState("");
    const [dummy, setDummy] = useState<any>([]);
    const parentDivRef = useRef(null);
    const oid = project.oid;
  
    // Use the atom to manage the editor instance
    const [editor, setEditor] = useAtom(editorAtom);
  
    // Initialize editor instance and store it in Jotai atom
    const editorInstance = useEditor({
      extensions: [
        Document,
        Bold,
        Strike,
        Italic,
        Text,
        Image.configure({ inline: true, allowBase64: true }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Focus.configure({ className: "has-focus", mode: "all" }),
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
        HardBreak.configure({ keepMarks: true }),
        Placeholder.configure({
          placeholder: "ブロックを選択するかテキストを入力",
          showOnlyCurrent: false,
          includeChildren: true,
        }),
      ],
      onSelectionUpdate(props) {
        const { selection } = props.editor.state;
        let node = selection.$from.node(1);
        if (node) {
          setSelectionNode(node);
          if (selection.$anchor.parent.type.name === "speaker") {
            setSpeakerInput(selection.$anchor.parent.textContent);
          }
        } else {
          setSelectionNode(null);
        }
      },
      onUpdate: async ({ editor }: any) => {
        saveContentAsJSON(editor);
        setCharacterList(getCharacterList(editor));
        try {
          await saveJSONToS3({ oid, content: editor.getHTML() });
          console.log("Content saved to S3 successfully");
        } catch (error) {
          console.error("Error saving content to S3:", error);
        }
      },
      content: initialContent,
      onBlur: ({ editor }: any) => {
        setDummy({
          content: editor.getHTML(),
        });
      },
    });
  
    // Store editor instance in the atom after initialization
    useEffect(() => {
      if (editorInstance) {
        setEditor(editorInstance);
      }
    }, [editorInstance, setEditor]);
  
    if (!editorInstance) return <div>Loading...</div>;
  
    return (
      <div className="overflow-x-hidden overflow-y-scroll">
        <div className="flex h-screen w-screen">
          <div
            className="flex-1 p-4 min-w-0 max-w-full h-full mx-auto overflow-auto"
            ref={parentDivRef}
          >
            {flashMessage && (
              <div
                className="flash-message absolute top-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">エラー!</strong>
                <span className="block sm:inline pl-6">{flashMessage}</span>
              </div>
            )}
            <EditorContent editor={editorInstance} className="w-full h-85vh" />
          </div>
        </div>
        <CustomBubbleMenu
          editor={editorInstance}
          characterList={characterList}
          speakerinput={speakerinput}
        />
      </div>
    );
  }
  