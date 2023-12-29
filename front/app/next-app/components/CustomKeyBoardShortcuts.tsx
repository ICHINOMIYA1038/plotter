import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";

const navigableNodeTypes = ['heading', 'paragraph', 'speaker', 'speechContent']

function findNextNodePos(doc: any, $head: any) {
    let nextNodePos: any = null;

    // $head の位置から走査を開始して次のノードを探す
    doc.nodesBetween($head.pos, doc.content.size, (node: any, pos: any) => {
        if (nextNodePos === null && pos > $head.pos) {
            // 次のノードの位置を記録
            nextNodePos = pos;
            return false; // 走査を停止
        }
    });

    return nextNodePos;
}


export const CustomKeyBoardShortcuts = Extension.create({
    name: "disableShiftEnter",

    addKeyboardShortcuts() {
        return {
            Tab: () => this.editor.chain().command(({ tr, dispatch }) => {
                const { selection } = tr
                const { $from } = selection

                let found = false
                tr.doc.nodesBetween($from.pos, tr.doc.content.size, (node, pos) => {
                    if (!found && pos > $from.pos) {
                        if (navigableNodeTypes.includes(node.type.name)) {
                            // 移動可能なノードを見つけた場合
                            dispatch(tr.setSelection(TextSelection.create(tr.doc, pos)))
                            found = true
                            return false // ループを停止
                        }
                    }
                })

                return found
            }).run(),
            Enter: () => this.editor.chain().command(({ tr, dispatch }) => {
                // speakerノードの場合、speechContentノードにカーソルを移動
                const { selection } = tr;
                const { $head, from, to } = selection;

                // 現在のノードとその位置を取得
                const node = $head.node(-1);
                if (!node) {
                    return false;
                }

                if (!node.type) {
                    return false;
                }

                // serifノードであることを確認
                if (node.type.name !== "serif") {
                    return false;
                }

                if ($head.node(2).type.name === "speaker") {
                    dispatch(tr.setSelection(TextSelection.create(tr.doc, findNextNodePos(this.editor.state.doc, $head) + 1)))
                    return true;
                } else if ($head.node(2).type.name === "speechContent") {
                    dispatch(tr.insert($head.end(0), this.editor.state.schema.nodes.paragraph.create()));
                    dispatch(tr.setSelection(TextSelection.create(tr.doc, $head.end(1) + 1)));
                    return true;
                } else {
                    return false
                }

                //speechContentノードの場合、次のノードにカーソルを移動。次のノードがない場合、新しいノードを挿入
            }).run(),
            Backspace: () => this.editor.chain().command(({ tr, dispatch }) => {
                const { state, view } = this.editor;
                const { selection } = tr;
                const { $head, from, to } = selection;

                // 現在のノードとその位置を取得
                const node = $head.node(-1);
                if (!node) {
                    return false;
                }

                if (!node.type) {
                    return false;
                }


                // serifノードであることを確認
                if (node.type.name !== "serif") {
                    return false;
                }

                const speakerNode = node.child(0);
                const speechContentNode = node.child(1);

                // speechContentノードにカーソルがあり、かつ、ノードが空の場合、speakerノードにカーソルが移動。
                if ($head.node(2).type.name === "speechContent" && speechContentNode.content.size === 0) {
                    dispatch(tr.setSelection(TextSelection.create(tr.doc, $head.pos - 2)))
                    return true;
                } else if (speakerNode.content.size === 0 && speechContentNode.content.size === 0) {
                    const startPos = $head.before(-1);
                    const endPos = startPos + node.nodeSize;
                    const transaction = tr.delete(startPos, endPos);
                    dispatch(transaction);
                    return true;
                } else {
                    return false
                }
            }).run(),

        };
    },
});

const insertSerifNode = (editor: any) => {
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
