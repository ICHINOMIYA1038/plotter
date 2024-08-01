import { Editor } from "@tiptap/react";

export const insertCharactersNode = (editor: Editor) => {
  if (editor) {
    // エディタの選択位置を取得
    const { selection } = editor.state;
    const position = selection.anchor;

    // トランザクションを使用して新しいノードを挿入
    editor
      .chain()
      .focus()
      .insertContent({
        type: "characters",
        content: [
          // h5 タグ（登場人物タイトル）
          {
            type: "heading",
            attrs: { level: 5 },
            content: [
              {
                type: "text",
                text: "登場人物",
              },
            ],
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
          },
        ],
      })
      .run();
  }
};

export const insertSerifNode = (editor: Editor) => {
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
