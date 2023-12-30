import React, { useState } from 'react';
import { useEditor, BubbleMenu } from '@tiptap/react';
import Tippy from '@tippyjs/react';




export const CustomBubbleMenu = ({ editor }: any) => {



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

    const isSpeakerNodeSelected = (editor) => {
        // 選択範囲のノードタイプを取得して、それがSpeakerノードかどうかチェック
        const { selection } = editor.state;
        let node;
        if (selection.$anchor) {
            node = selection.$anchor.parent;
        }
        return node && node.type.name === 'speaker'; // 'speaker'はノードのタイプ名に応じて変更
    };

    const speakerOptions = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        // 他のオプション
    ];



    const renderMenuItems = () => {
        if (!isSpeakerNodeSelected(editor)) {
            console.log("speaker node selected")
            return (
                <>
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
                                onClick={() => { editor.chain().focus(); setMenu("main") }}
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
                    )}</>)
        }
        // 他の条件に応じたメニューアイテムをここに追加
    };

    return (
        <Tippy
            visible={editor.isFocused} // ここを変更
            content={renderMenuItems()}
            placement="right"
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
