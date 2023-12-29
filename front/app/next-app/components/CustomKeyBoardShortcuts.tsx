import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";

const navigableNodeTypes = ['heading', 'paragraph', 'speaker', 'speechContent']


export const CustomKeyBoardShortcuts = Extension.create({
    name: "disableShiftEnter",

    addKeyboardShortcuts() {
        return {
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
            Backspace: () => {
                const { state, view } = this.editor;
                const { selection, tr } = state;
                const { $head, from, to } = selection;

                // 現在のノードとその位置を取得
                const node = $head.node(-1);



                // serifノードであることを確認
                if (node.type.name !== "serif") {
                    return false;
                }

                const speakerNode = node.child(0);
                const speechContentNode = node.child(1);

                console.log(speakerNode)
                console.log($head.node(1).type.name)
                // speechContentノードにカーソルがあり、かつ、ノードが空の場合、speakerノードにカーソルが移動。
                if ($head.node(-2).type.name === "speakerNode" && speechContentNode.content.size === 0) {
                    const transaction = state.tr.setSelection(TextSelection.create(tr.doc, from - 1));
                    view.dispatch(transaction);
                    return true;
                }

                if (speakerNode.content.size === 0 && speechContentNode.content.size === 0) {
                    const startPos = $head.before(-1);
                    const endPos = startPos + node.nodeSize;
                    const transaction = state.tr.delete(startPos, endPos);
                    view.dispatch(transaction);
                }
                return false;
            },

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
