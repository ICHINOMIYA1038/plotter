import { Editor } from "@tiptap/react";

export function getCharacterList(editor: Editor) {
    const listContents: any = [];

    // エディタの内容をトラバースしてulノードを見つける
    editor.state.doc.descendants((node: any, pos: any) => {
        if (node.type.name === 'bulletList') { // ulノードをチェック
            node.forEach((childNode: any, childPos: any) => {
                if (childNode.type.name === 'listItem') { // liノードをチェック
                    // liノードのテキスト内容を取得し、配列に追加
                    listContents.push(childNode.textContent);
                }
            });
        }
    });

    return listContents;
}