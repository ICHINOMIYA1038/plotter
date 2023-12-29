import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";

const navigableNodeTypes = ['heading', 'paragraph', 'speaker', 'speechContent']


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
            Enter: () => {
                const selection = this.editor.state.selection;
                const { $head } = selection;
                const parentNodeType = $head.parent.type.name;
                const grandparentNodeType = $head.node(-1).type.name; // 親の親ノードのタイプ
                if (
                    grandparentNodeType === "speaker" ||
                    grandparentNodeType === "speechContent"
                ) {
                    insertSerifNode(this.editor);
                    console.log("serif insert");
                    return true;
                }
                return false; // Enterのデフォルトの動作を防止
            },
            Backspace: () => this.editor.chain().command(({ tr, dispatch }) => {
                const { state, view } = this.editor;
                const { selection } = tr;
                const { $head, from, to } = selection;

                // 現在のノードとその位置を取得
                const node = $head.node(-1);
                console.log(node.type.name)


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
