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
  const savedName = localStorage.getItem("projectName");
  link.download = `${savedName}.json`;
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

  content!.forEach((element) => {
    switch (element.type) {
      case "heading":
        // Checking if content array is present and has elements
        if (element.content && element.content.length > 0) {
          scriptText += `\n${element.content[0].text}\n`;
        }
        break;
      case "characters":
        scriptText += "\n登場人物:\n"; // Characters heading
        element.content?.forEach((charItem) => {
          // Handling characterItem
          if (charItem.type === "characterItem") {
            const characterNameElement = charItem.content?.find(
              (el) => el.type === "characterName"
            );
            const characterDetailElement = charItem.content?.find(
              (el) => el.type === "characterDetail"
            );
            const characterName =
              characterNameElement &&
              characterNameElement.content &&
              characterNameElement.content.length > 0
                ? characterNameElement.content[0].text
                : "";
            const characterDetail =
              characterDetailElement &&
              characterDetailElement.content &&
              characterDetailElement.content.length > 0
                ? characterDetailElement.content[0].text
                : "";
            if (characterName || characterDetail) {
              scriptText += `・${characterName}: ${characterDetail}\n`;
            }
          }
        });
        break;
      case "serif":
        // Safely accessing speakerElement and speechElement
        const speakerElement = element.content?.find(
          (el) => el.type === "speaker"
        );
        const speechElement = element.content?.find(
          (el) => el.type === "speechContent"
        );
        const speaker =
          speakerElement &&
          speakerElement.content &&
          speakerElement.content.length > 0
            ? speakerElement.content[0].text
            : "";
        const speech =
          speechElement &&
          speechElement.content &&
          speechElement.content.length > 0
            ? speechElement.content[0].text
            : "";
        if (speaker || speech) {
          scriptText += `\n${speaker}: ${speech}\n`;
        }
        break;
      // Add other cases as needed
      // ...
    }
  });

  const blob = new Blob([scriptText], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  const savedName = localStorage.getItem("projectName");
  link.download = `${savedName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
