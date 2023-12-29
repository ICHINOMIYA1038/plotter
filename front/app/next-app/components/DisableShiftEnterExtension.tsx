import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";

const navigableNodeTypes = ['heading', 'paragraph', 'speaker', 'speechContent']


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
        const selection = this.editor.state.selection;
        const { $head } = selection;
        const grandparentNode = $head.node(-2);
        let speakerNode: any = null;
        if (grandparentNode != null) {
          grandparentNode.content.forEach((childNode) => {
            if (childNode.type.name === "speechContent") {
              speakerNode = childNode;
            }
          });
        }

        if (
          $head.parent.type.name === "speechContent" &&
          $head.parent.textContent.trim() === ""
        ) {
          const grandparent = $head.node(-1); // speechContentの親ノード (おそらくspeaker)
          return true;
        } else if (
          $head.parent.type.name === "speaker" &&
          $head.parent.textContent.trim() === "" &&
          speakerNode &&
          typeof speakerNode.textContent !== "undefined" &&
          speakerNode.textContent.trim() === ""
        ) {
          return true;
        } else if (
          $head.parent.type.name === "speaker" &&
          $head.parent.textContent.trim() === "" &&
          speakerNode &&
          typeof speakerNode.textContent !== "undefined" &&
          speakerNode.textContent.trim() === ""
        ) {
          return true;
        }
        // 他の条件の場合は、Backspaceのデフォルトの動作を行う
        return false;
      },
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
