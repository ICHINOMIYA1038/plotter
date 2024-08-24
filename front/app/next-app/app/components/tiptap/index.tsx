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


// JSON形式での読み込み
const loadContentFromJSON = () => {
  const content = localStorage.getItem("editor-json-content");
  return content ? JSON.parse(content) : JSON.parse(exampleJSON);
};

export default function TipTap({ setData, data, setContent }: any) {
  const [selectionNode, setSelectionNode] = useState<any>(null); // 選択中のノードを一時的に保持するための状態
  const [toc, setToc] = useState([]);
  const parentDivRef = useRef(null);
  const [characterList, setCharacterList] = useState([]);
  const [speakerinput, setSpeakerInput] = useState("");
  const [flashMessage, setFlashMessage] = useState('');
  const [initialContent, setInitialContent] = useState(() => {
    if (typeof window !== "undefined") {
      return loadContentFromJSON();
    } else {
      return JSON.parse(exampleJSON);
    }
  });

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
    onUpdate: ({ editor }: any) => {
      updateToc();
      saveContentAsJSON(editor);

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

const exampleJSON = `{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "操作方法"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#f30707"
              }
            }
          ],
          "text": "これはサンプルです。画面上部のゴミ箱のマークを押すと、全て削除することができます。"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#ec1515"
              }
            }
          ],
          "text": "注意"
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ],
          "text": " このエディタはベータ版 開発中です。"
        },
        {
          "type": "hardBreak",
          "marks": [
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ]
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ],
          "text": "執筆のデータはローカルストレージを利用して保存しています。"
        },
        {
          "type": "hardBreak",
          "marks": [
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ]
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ],
          "text": "ブラウザの設定により、一定期間で削除される場合や、文字数の制限が異なる場合があります。"
        },
        {
          "type": "hardBreak",
          "marks": [
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            }
          ]
        },
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            },
            {
              "type": "textStyle",
              "attrs": {
                "color": "#0e0101"
              }
            },
            {
              "type": "highlight",
              "attrs": {
                "color": "#ffff0d"
              }
            }
          ],
          "text": "個人情報や機密情報はセキュリティの関係上、書き込まないでください。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "データの保存方法"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "現在はJSONファイルを介しての保存をお願いしています。左側のJSONに出力をしてJSONファイルを作成。ファイル入力から、そのデータを読み込んでください。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "ブロックの説明"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "ブロックごとにレイアウトが異なります。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "標準ブロック"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "標準ブロックは、汎用的なブロックです。補足の説明などに用います。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ],
          "text": "タイトルブロック"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "タイトル"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "タイトルブロックは、主に冒頭のタイトルに用います。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "目次に反映されます。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ],
          "text": "シーンブロック"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "第一章"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "シーンブロックは、シーンの区切りに使います。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "目次に反映されます。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ],
          "text": "セリフブロック"
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker",
          "content": [
            {
              "type": "text",
              "text": "男1"
            }
          ]
        },
        {
          "type": "speechContent",
          "content": [
            {
              "type": "text",
              "text": "こんにちは。"
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "セリフブロックは、話者と発言内容がセットになっています。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "作者ブロック"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 4
      },
      "content": [
        {
          "type": "text",
          "text": "作：森ふみ夫"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "作者ブロックは、作者名に用いられます。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "登場人物ブロック"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "登場人物ブロックは、登場人物の名前と詳細がセットになっています。ここで記述された登場人物名は、セリフブロックの話者名で選択できるようになります。"
        }
      ]
    },
    {
      "type": "characters",
      "content": [
        {
          "type": "heading",
          "attrs": {
            "textAlign": "left",
            "level": 5
          },
          "content": [
            {
              "type": "text",
              "text": "登場人物"
            }
          ]
        },
        {
          "type": "characterItem",
          "content": [
            {
              "type": "characterName",
              "content": [
                {
                  "type": "text",
                  "text": "ユキオ"
                }
              ]
            },
            {
              "type": "characterDetail",
              "content": [
                {
                  "type": "text",
                  "text": "明るく前向きな高校教師"
                }
              ]
            }
          ]
        },
        {
          "type": "characterItem",
          "content": [
            {
              "type": "characterName",
              "content": [
                {
                  "type": "text",
                  "text": "タカシ"
                }
              ]
            },
            {
              "type": "characterDetail",
              "content": [
                {
                  "type": "text",
                  "text": "進路に悩む男子高校生"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "ト書きブロック"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "ト書きブロックは、ト書きの作成に用いられます。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "ト書きでは人物の行動や場面の様子を描写します。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "ユキオは、公園のベンチに腰をかける。"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "具体例"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "骨壷"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 4
      },
      "content": [
        {
          "type": "text",
          "text": "森ふみ"
        }
      ]
    },
    {
      "type": "characters",
      "content": [
        {
          "type": "heading",
          "attrs": {
            "textAlign": "left",
            "level": 5
          },
          "content": [
            {
              "type": "text",
              "text": "登場人物"
            }
          ]
        },
        {
          "type": "characterItem",
          "content": [
            {
              "type": "characterName",
              "content": [
                {
                  "type": "text",
                  "text": "妻"
                }
              ]
            },
            {
              "type": "characterDetail",
              "content": [
                {
                  "type": "text",
                  "text": "息子の死から時間が止まったかのように、受け入れることのできない日々を過ごしている。"
                }
              ]
            }
          ]
        },
        {
          "type": "characterItem",
          "content": [
            {
              "type": "characterName",
              "content": [
                {
                  "type": "text",
                  "text": "夫"
                }
              ]
            },
            {
              "type": "characterDetail",
              "content": [
                {
                  "type": "text",
                  "text": "妻の悲しむ姿を見て、なんとかしたいと思いつつも、コミニュケーションに悩んでいる。"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "第一幕"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "夏・和室。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "蝉の声。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "妻、机の上の容器を眺めている。"
        },
        {
          "type": "hardBreak"
        },
        {
          "type": "text",
          "text": "夫、そこに通りがかり、"
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker",
          "content": [
            {
              "type": "text",
              "text": "夫"
            }
          ]
        },
        {
          "type": "speechContent",
          "content": [
            {
              "type": "text",
              "text": "なにしてん"
            }
          ]
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker",
          "content": [
            {
              "type": "text",
              "text": "妻"
            }
          ]
        },
        {
          "type": "speechContent",
          "content": [
            {
              "type": "text",
              "text": "なんでもええやん"
            }
          ]
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker",
          "content": [
            {
              "type": "text",
              "text": "夫"
            }
          ]
        },
        {
          "type": "speechContent",
          "content": [
            {
              "type": "text",
              "text": "もう忘れえや"
            }
          ]
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker",
          "content": [
            {
              "type": "text",
              "text": "妻"
            }
          ]
        },
        {
          "type": "speechContent",
          "content": [
            {
              "type": "text",
              "text": "いやや"
            }
          ]
        }
      ]
    },
    {
      "type": "serif",
      "content": [
        {
          "type": "speaker"
        },
        {
          "type": "speechContent"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "お願い"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "このエディタは現在開発中です。"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "開発・維持費のためにご支援いただけますと幸いです。"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "https://ofuse.me/gikyokutosyokan",
                "target": "_blank",
                "rel": "noopener noreferrer nofollow",
                "class": null
              }
            }
          ],
          "text": "支援・メッセージはこちらから"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "textAlign": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "問い合わせ"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "https://twitter.com/gekidankatakago",
                "target": "_blank",
                "rel": "noopener noreferrer nofollow",
                "class": null
              }
            }
          ],
          "text": "x/twitter"
        }
      ]
    },
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "メール：gekidankatakago@gmail.com"
        }
      ]
    }
  ]
}`;
