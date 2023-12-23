import { Editor } from "@tiptap/react";

/**
 * JSON 形式のデータを TipTap エディタに設定する関数。
 * @param {Object} editor - TipTap エディタのインスタンス。
 * @param {Object} jsonData - エディタの内容を表す JSON オブジェクト。
 */
const JSONToEditor = (editor: Editor, jsonData: String) => {
  if (!editor) {
    console.error("Editor instance is not provided");
    return;
  }

  if (!jsonData) {
    console.error("JSON data is not provided");
    return;
  }

  try {
    // JSON データをエディタに設定
    editor.commands.setContent(jsonData);
  } catch (error) {
    console.error("Error setting JSON content to the editor:", error);
  }
};

export default JSONToEditor;
