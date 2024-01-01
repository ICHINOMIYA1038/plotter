import { Editor } from "@tiptap/react";

/**
 * TipTap エディタの内容を JSON 形式で出力する関数。
 * @param {Object} editor - TipTap エディタのインスタンス。
 */
const EditorToJSON = (editor: Editor) => {
  if (!editor) {
    console.error("Editor instance is not provided");
    return;
  }

  // エディタの内容を JSON 形式で取得
  const content = editor.getJSON();
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });

  // Blob をダウンロード可能なファイルとして提供
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "editor-content.json";
  document.body.appendChild(link); // リンクを DOM に追加
  link.click(); // リンクを自動クリック
  document.body.removeChild(link); // リンクを DOM から削除
  URL.revokeObjectURL(link.href); // URL オブジェクトを解放
};

export default EditorToJSON;

export const EditorToTextFile = (editor: Editor) => {
  if (!editor) {
    console.error("Editor instance is not provided");
    return;
  }

  const content = editor.getJSON().content;
  let scriptText = "";

  content.forEach((element) => {
    switch (element.type) {
      case "heading":
        // Add the heading to the script
        scriptText += `\n${element.content[0].text}\n`;
        break;
      case "characters":
        scriptText += "\n登場人物:\n"; // Characters heading
        element.content.forEach((charItem) => {
          if (charItem.type === "characterItem") {
            const characterName = charItem.content.find(
              (el) => el.type === "characterName"
            ).content[0].text;
            const characterDetail = charItem.content.find(
              (el) => el.type === "characterDetail"
            ).content[0].text;
            scriptText += `・${characterName}: ${characterDetail}\n`;
          }
        });
        break;
      case "serif":
        // Format dialogues
        const speaker = element.content.find((el) => el.type === "speaker")
          .content[0].text;
        const speech = element.content.find((el) => el.type === "speechContent")
          .content[0].text;
        scriptText += `\n${speaker}: ${speech}\n`;
        break;
      // Add other cases as needed
      // ...
    }
  });

  const blob = new Blob([scriptText], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "script-content.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
