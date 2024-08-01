import { TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";
import { Fragment } from "prosemirror-model";
// changeNodeType 関数の更新
export const changeNodeType = (
    editor: Editor,
    nodePos: any,
    newNodeType: any,
    oldNode: any,
    level: any = null
) => {
    const attrs = { ...oldNode.attrs };

    // Serifノードの特別な扱い
    if (newNodeType === "serif") {
        // 既存のテキストを結合
        const combinedText = oldNode.content.content
            .map((node: any) => node.textContent)
            .join("");

        let speechContent;


        if (combinedText) {
            // combinedTextが存在する場合、テキストノードと共にspeechContentノードを作成
            speechContent = editor.schema.nodes.speechContent.create(
                null,
                Fragment.from(editor.schema.text(combinedText))
            );
        } else {
            // combinedTextが空の場合、テキストノードなしでspeechContentノードを作成
            speechContent = editor.schema.nodes.speechContent.create(null);
        }

        // speakerノードは空の状態で作成
        const speakerNode = editor.schema.nodes.speaker.create(
            null
        );

        // Serifノードの作成
        const serifNode = editor.schema.nodes.serif.create(
            null,
            Fragment.from([speakerNode, speechContent])
        );

        // ノードの置換
        let transaction = editor.state.tr.replaceWith(
            nodePos,
            nodePos + oldNode.nodeSize,
            serifNode
        );

        // 選択範囲の更新
        const newSelection = TextSelection.create(
            transaction.doc,
            nodePos + serifNode.nodeSize
        );
        transaction = transaction.setSelection(newSelection);

        editor.view.dispatch(transaction);
    } else {
        // 他のノードタイプへの変換処理
        if (newNodeType === "heading" && level) {
            attrs.level = level;
        }
        const nodeType = editor.schema.nodes[newNodeType];
        const combinedText = oldNode.content.content
            .map((node: any) => node.textContent)
            .join("");

        let newNode;

        if (combinedText) {
            // combinedTextが存在する場合、テキストノードを含む新しいノードを作成
            const textNode = editor.schema.text(combinedText);
            newNode = nodeType.create(
                attrs,
                Fragment.from(textNode),
                oldNode.marks
            );
        } else {
            // combinedTextが空の場合、テキストノードなしで新しいノードを作成
            newNode = nodeType.create(
                attrs,
                Fragment.empty,
                oldNode.marks
            );
        }
        let transaction = editor.state.tr.replaceWith(
            nodePos,
            nodePos + oldNode.nodeSize,
            newNode
        );
        const newSelection = TextSelection.create(
            transaction.doc,
            nodePos + newNode.nodeSize
        );
        transaction = transaction.setSelection(newSelection);
        editor.view.dispatch(transaction);
    }
};