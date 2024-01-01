import React, { useState } from 'react';
import { useEditor, BubbleMenu } from '@tiptap/react';
import Tippy from '@tippyjs/react';
import { insertCharactersNode, insertSerifNode } from '../InsertCustomNode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { set } from 'react-hook-form';
import { changeNodeType } from '../ChangeNodeType';
import { findNodePosition } from '../FindNodePosition';




export const CustomBubbleMenu = ({ editor, characterList, speakerinput }: any) => {

    const [menu, setMenu] = useState("main"); // 'main', 'decoration', 'heading', 'pageBreak'
    const [serifContentMenu, setSerifContentMenu] = useState("main"); // 'main', 'decoration', 'heading', 'pageBreak'
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
            const filteredCharacterList = characterList.filter((character: any) => {
                const regex = new RegExp(speakerinput, 'i'); // 大文字小文字を区別しない
                return regex.test(character.name);
            });

            // speakerNodeを更新する関数
            const updateSpeakerNode = (characterName: any) => {
                if (!editor || !isSpeakerNodeSelected()) {
                    return;
                }
                // editorはTipTapエディターのインスタンスです
                const { state } = editor;

                // 選択範囲を取得する
                const { from, to } = state.selection;

                // 選択範囲内にある最初のテキストブロックを見つける
                let blockPos = null;
                state.doc.nodesBetween(from, to, (node, pos) => {
                    if (blockPos === null && node.isTextblock) {
                        blockPos = pos;
                    }
                });

                // テキストブロックが見つかった場合、その内容を置き換える
                if (blockPos !== null) {
                    const blockNode = state.doc.nodeAt(blockPos);
                    const blockEnd = blockPos + blockNode.nodeSize;
                    const newContent = state.schema.text(characterName); // 新しいテキストノードを作成

                    // トランザクションを作成してテキストブロックの内容を置き換える
                    const tr = state.tr.replaceWith(blockPos, blockEnd, newContent);
                    editor.view.dispatch(tr);
                }
            };


            return (<><div className='flex flex-col'>
                {isSpeakerNodeSelected() && filteredCharacterList.map((character, index) => (
                    <>
                        {
                            (character.name != "") &&
                            < button key={index}
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => updateSpeakerNode(character.name)}>
                                {character.name}
                            </button>
                        }
                    </>
                ))}
                <button
                    className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                    onClick={() => {
                        editor.chain().focus().deleteNode("serif").run()
                    }}
                >
                    ブロック削除
                </button >
            </div ></>)
        }

        if (isSpaeachContentSelected()) {
            return (<div className="flex flex-col">

                {menu === "main" &&
                    <>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() => { editor.chain().focus(); setMenu("block") }}
                        >
                            ブロック
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-red-500 shadow-lg"
                            onClick={() => {
                                editor.chain().focus().deleteNode("serif").run()

                            }}
                        >
                            ブロック削除
                            <FontAwesomeIcon icon={faTrashAlt} className='pl-2' />
                        </button >
                    </>
                }
                {menu === "block" &&
                    <>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "paragraph", editor.state.selection.$head.node(1))
                            }
                        >
                            標準
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 1)
                            }
                        >
                            タイトル
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 2)
                            }
                        >
                            シーン
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 3)
                            }
                        >
                            ト書き
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 4)
                            }
                        >
                            作者
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                            onClick={() => { editor.chain().focus(); setMenu("main") }}
                        >
                            戻る
                        </button>
                    </>
                }
            </div>)
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
                        onClick={() => { insertSerifNode(editor) }}
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
                        onClick={() => { insertCharactersNode(editor) }}>
                        登場人物
                    </button>
                </div>
            )
        }

        if (isParagrahSelectedAndNotBlank() || isHeading()) {
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
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-red-500 shadow-lg"
                                onClick={() => {
                                    editor.chain().focus().deleteNode("paragraph").run()

                                }}
                            >
                                削除
                                <FontAwesomeIcon icon={faTrashAlt} className='pl-2' />
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
                                太字
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            >
                                斜体
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                            >
                                下線
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-black font-semibold text-left align-middle text-base border-4 border-gray-500 shadow-lg"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                            >
                                打ち消し線
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
                                onClick={() => { insertCharactersNode(editor) }}>
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
