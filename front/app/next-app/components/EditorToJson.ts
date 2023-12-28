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
