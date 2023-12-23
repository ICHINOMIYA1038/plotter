import { Extension } from "@tiptap/core";

export const DisableShiftEnterExtension = Extension.create({
  name: "disableShiftEnter",

  addKeyboardShortcuts() {
    return {
      "Shift-Enter": () => {
        if (this.editor.state.selection.$head.parent.type.name === "speaker") {
          // 現在のカーソル位置の末尾に改行を挿入
          this.editor.commands.setHardBreak();
          return true;
        } else if (
          this.editor.state.selection.$head.parent.type.name === "speechContent"
        ) {
          // 現在のカーソル位置の末尾に改行を挿入
          this.editor.commands.setHardBreak();

          return true;
        }
        return false; // イベントをここで消費し、他のハンドラが実行されないようにする
      },
    };
  },
});
