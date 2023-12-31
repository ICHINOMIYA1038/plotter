import React, { useState } from 'react';
import { useEditor, BubbleMenu } from '@tiptap/react';
import Tippy from '@tippyjs/react';




export const CustomBubbleMenu = ({ editor }: any) => {


    const insertCharactersNode = () => {
        if (editor) {
            // エディタの選択位置を取得
            const { selection } = editor.state;
            const position = selection.anchor;

            // トランザクションを使用して新しいノードを挿入
            editor.chain().focus().insertContent({
                type: "characters",
                content: [
                    // h5 タグ（登場人物タイトル）
                    {
                        type: "heading",
                        attrs: { level: 5 },
                        content: [{
                            type: "text",
                            text: "登場人物"
                        }]
                    },
                    // characterItem ノード
                    {
                        type: "characterItem",
                        content: [
                            {
                                type: "characterName",

                            },
                            {
                                type: "characterDetail",

                            },
                        ],
                    },
                    {
                        type: "characterItem",
                        content: [
                            {
                                type: "characterName",

                            },
                            {
                                type: "characterDetail",

                            },
                        ],
                    }
                ]
            }).run();
        }
    };

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
                        },
                        {
                            type: "speechContent",
                        },
                    ],
                })
                .run();
        }
    };



    const [menu, setMenu] = useState("main"); // 'main', 'decoration', 'heading', 'pageBreak'
    const isTextSelected = () => {
        // テキストが選択されているかチェック
        return !editor.state.selection.empty;
    };
    const getReferenceClientRect = () => {
        if (!editor || !editor.view) {
            return new DOMRect();
        }
        const { from, to } = editor.state.selection;
        const start = editor.view.coordsAtPos(from);
        const end = editor.view.coordsAtPos(to);

        // DOMRect オブジェクトを作成して返す
        return new DOMRect(
            start.left,
            start.top,
            end.right - start.left,
            end.bottom - start.top
        );
    };

    const isSpeakerNodeSelected = () => {
        // 選択範囲のノードタイプを取得して、それがSpeakerノードかどうかチェック
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.parent;
        }
        return node && node.type.name === 'speaker'; // 'speaker'はノードのタイプ名に応じて変更
    };

    const isSpaeachContentSelected = () => {
        // 選択範囲のノードタイプを取得して、それがSpeechContentノードかどうかチェック
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.parent;
        }
        return node && node.type.name === 'speechContent'; // 'speechContent'はノードのタイプ名に応じて変更
    }


    const isParagrahSelectedAndNotBlank = () => {
        // 選択範囲のノードタイプを取得して、それがSpeakerノードかどうかチェック
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.parent;
        }
        return node && node.type.name === 'paragraph' && node.content.size !== 0;
    }

    // パラグラフノードかつ内容が空の場合
    const isParagraphAndContentBlank = () => {
        const { selection } = editor.state;
        let node;
        if (selection.$head) {
            node = selection.$head.parent;
        }
        return node && node.type.name === 'paragraph' && node.content.size === 0;
    }

    const isCharactersNodeSelected = () => {
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.node(1);
        }
        return node && node.type.name === 'characters';
    }

    const isHeading = () => {
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.parent;
        }
        return node && node.type.name === 'heading';
    }


    const speakerOptions = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        // 他のオプション
    ];



    const renderMenuItems = () => {
        if (isSpeakerNodeSelected()) {
            return (<></>)
        }

        if (isSpaeachContentSelected()) {
            return (<></>)
        }

        if (isCharactersNodeSelected()) {
            return (
                <div className="flex flex-col">
                    <button className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                        onClick={() =>
                            editor.chain().focus().insertContentAt(editor.state.selection.$head.end(2), {
                                type: "characterItem",
                                content: [
                                    {
                                        type: "characterName",
                                    },
                                    {
                                        type: "characterDetail",
                                    },
                                ],
                            }).run()
                        }
                    >
                        人物を追加
                    </button >
                    <button
                        className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                        onClick={() => {
                            editor.chain().focus().deleteNode("characterItem").run()
                        }}
                    >
                        人物を削除
                    </button >
                    <button
                        className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                        onClick={() => {
                            editor.chain().focus().deleteNode("characters").run()
                        }}
                    >
                        ブロック削除
                    </button ></div >)
        }


        if (isParagraphAndContentBlank()) {
            return (
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
                        onClick={insertCharactersNode}>
                        登場人物
                    </button>
                </div>
            )
        }

        if (isParagrahSelectedAndNotBlank() || isHeading()) {
            console.log("speaker node selected")
            return (
                <>
                    {menu === "main" && (
                        <div className="flex flex-col">
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => { editor.chain().focus(); setMenu("decoration") }}
                            >
                                装飾
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => { editor.chain().focus(); setMenu("heading") }}
                            >
                                ブロック
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => {
                                    editor.chain().focus().deleteNode("paragraph").run()
                                    editor.chain().focus().deleteNode("heading").run()
                                }}
                            >
                                ブロック削除
                            </button >
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
                                onClick={() => { editor.chain().focus(); setMenu("main") }}
                            >
                                戻る
                            </button>
                        </div>
                    )}

                    {/* 見出し・段落サブメニュー */}
                    {menu === "heading" && (
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
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => { editor.chain().focus(); setMenu("main") }}
                            >
                                戻る
                            </button>
                        </div >
                    )}</>)
        }
        // 他の条件に応じたメニューアイテムをここに追加
    };

    return (
        <Tippy
            visible={editor.isFocused} // ここを変更
            content={renderMenuItems()}
            placement="right"
            offset={[0, 50]}
            getReferenceClientRect={getReferenceClientRect}
            interactive={true} // Tippyがインタラクティブであることを設定
            appendTo={() => document.body} // Tippyのポップアップをbody要素に追加
        >
            <BubbleMenu editor={editor} tippyOptions={{ placement: 'right' }}>
                <></>
            </BubbleMenu>
        </Tippy>
    );
};
