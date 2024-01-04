import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react';
import Tippy from '@tippyjs/react';
import { insertCharactersNode, insertSerifNode } from '../InsertCustomNode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { changeNodeType } from '../ChangeNodeType';
import { findNodePosition } from '../FindNodePosition';

export const CustomBubbleMenu = ({ editor, editorRef, characterList, speakerinput }: any) => {

    const [menu, setMenu] = useState("main"); // 'main', 'decoration', 'heading', 'pageBreak'
    const [serifContentMenu, setSerifContentMenu] = useState("main");
    const [speakerManu, setSpeakerMenu] = useState("main")
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
                let blockPos: any = null;
                state.doc.nodesBetween(from, to, (node: any, pos: any) => {
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


            return (
                <>
                    < div className='flex flex-col'>
                        {speakerManu == "main" && (
                            <>
                                {isSpeakerNodeSelected() && filteredCharacterList.map((character: any, index: any) => (
                                    <>
                                        {
                                            (character.name != "") &&
                                            <button key={index}
                                                className="bubble-menu-btn"
                                                onClick={() => updateSpeakerNode(character.name)}>
                                                {character.name}
                                            </button>
                                        }
                                    </>
                                ))}
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() => { editor.chain().focus(); setSpeakerMenu("block") }}
                                >
                                    ブロック
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() => {
                                        editor.chain().focus().deleteNode("serif").run()
                                    }}
                                >
                                    ブロック削除
                                </button >
                            </>
                        )
                        }
                        {speakerManu == "block" &&
                            <>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() =>
                                        changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "paragraph", editor.state.selection.$head.node(1))
                                    }
                                >
                                    標準
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() =>
                                        changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 1)
                                    }
                                >
                                    タイトル
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() =>
                                        changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 2)
                                    }
                                >
                                    シーン
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() =>
                                        changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 3)
                                    }
                                >
                                    ト書き
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() =>
                                        changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 4)
                                    }
                                >
                                    作者
                                </button>
                                <button
                                    className="bubble-menu-btn"
                                    onClick={() => { editor.chain().focus(); setSpeakerMenu("main") }}
                                >
                                    戻る
                                </button>
                            </>

                        }
                    </div >
                </>)
        }

        if (isSpaeachContentSelected()) {
            return (<div className="flex flex-col">

                {serifContentMenu === "main" &&
                    <>
                        <button
                            className="bubble-menu-btn"
                            onClick={() => { editor.chain().focus(); setSerifContentMenu("block") }}
                        >
                            ブロック
                        </button>
                        <button
                            className="bubble-menu-btn-delete"
                            onClick={() => {
                                editor.chain().focus().deleteNode("serif").run()

                            }}
                        >
                            ブロック削除
                            <FontAwesomeIcon icon={faTrashAlt} className='pl-2' />
                        </button >
                    </>
                }
                {serifContentMenu === "block" &&
                    <>
                        <button
                            className="bubble-menu-btn"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "paragraph", editor.state.selection.$head.node(1))
                            }
                        >
                            標準
                        </button>
                        <button
                            className="bubble-menu-btn"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 1)
                            }
                        >
                            タイトル
                        </button>
                        <button
                            className="bubble-menu-btn"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 2)
                            }
                        >
                            シーン
                        </button>
                        <button
                            className="bubble-menu-btn"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 3)
                            }
                        >
                            ト書き
                        </button>
                        <button
                            className="bubble-menu-btn"
                            onClick={() =>
                                changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$head.node(1)), "heading", editor.state.selection.$head.node(1), 4)
                            }
                        >
                            作者
                        </button>
                        <button
                            className="bubble-menu-btn"
                            onClick={() => { editor.chain().focus(); setSerifContentMenu("main") }}
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
                    <button className="bubble-menu-btn"
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
                        className="bubble-menu-btn"
                        onClick={() => {
                            editor.chain().focus().deleteNode("characterItem").run()
                        }}
                    >
                        人物を削除
                    </button >
                    <button
                        className="bubble-menu-btn-delete"
                        onClick={() => {
                            editor.chain().focus().deleteNode("characters").run()
                        }}
                    >
                        ブロック削除
                    </button ></div >)
        }


        if (isParagraphAndContentBlank()) {
            return (
                <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '250px' }}>
                    <button
                        className="bubble-menu-btn"
                        onClick={() =>
                            editor.chain().focus().setParagraph().unsetAllMarks().run()
                        }
                    >
                        標準
                    </button>
                    <button
                        className="bubble-menu-btn"
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                    >
                        タイトル
                    </button>
                    <button
                        className="bubble-menu-btn"
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                    >
                        シーン
                    </button>
                    <button
                        className="bubble-menu-btn"
                        onClick={() => { changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$from.node(1)), "serif", editor.state.selection.$from.node(1)) }}
                    >
                        セリフ
                    </button>
                    <button
                        className="bubble-menu-btn"
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                    >
                        ト書き
                    </button>
                    <button
                        className="bubble-menu-btn"
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 4 }).run()
                        }
                    >
                        作者
                    </button>
                    <button
                        className="bubble-menu-btn"
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
                                className="bubble-menu-btn"
                                onClick={() => { editor.chain().focus(); setMenu("decoration") }}
                            >
                                装飾
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => { editor.chain().focus(); setMenu("heading") }}
                            >
                                ブロック
                            </button>
                            <button
                                className="bubble-menu-btn-delete"
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
                                className="bubble-menu-btn"

                                onClick={() => editor.chain().focus().toggleBold().run()}
                            >
                                太字
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                            >
                                斜体
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                            >
                                下線
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                            >
                                打ち消し線
                            </button>
                            <button
                                className="bubble-menu-btn"
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
                                className="bubble-menu-btn"
                                onClick={() =>
                                    editor.chain().focus().setParagraph().unsetAllMarks().run()
                                }
                            >
                                標準
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                                }
                            >
                                タイトル
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                                }
                            >
                                シーン
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => { changeNodeType(editor, findNodePosition(editor.state.doc, editor.state.selection.$from.node(1)), "serif", editor.state.selection.$from.node(1)) }}
                            >
                                セリフ
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                                }
                            >
                                ト書き
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() =>
                                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                                }
                            >
                                作者
                            </button>
                            <button
                                className="bubble-menu-btn"
                                onClick={() => { insertCharactersNode(editor) }}>
                                登場人物
                            </button>
                            <button
                                className="bubble-menu-btn"
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
