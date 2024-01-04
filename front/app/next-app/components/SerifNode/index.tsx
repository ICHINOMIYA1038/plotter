import { Box } from "@kuma-ui/core";
import { Node } from "@tiptap/core";
import { Editor, ReactNodeViewRenderer } from "@tiptap/react";

export const Serif = Node.create({
  name: "serif",
  draggable: true,

  group: "block",

  content: "speaker speechContent",

  parseHTML() {
    return [
      {
        tag: "div.serif",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "serif" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeComponent);
  },

});

export const Speaker = Node.create({
  name: "speaker",

  content: "inline*",

  group: "serifPart",


  parseHTML() {
    return [
      {
        tag: "p.speaker", // `p` タグに `customClass` クラスが適用されているものを対象とします
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, class: "speaker" }, 0];
  },
});

export const SpeechContent = Node.create({
  name: "speechContent",

  content: "inline*",

  group: "serifPart",

  parseHTML() {
    return [
      {
        tag: "p.speechContent", // `p` タグに `customClass` クラスが適用されているものを対象とします
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { ...HTMLAttributes, class: "speechContent" }, 0];
  },
});


import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { FaGripHorizontal } from "react-icons/fa";

const CustomNodeComponent = ({ node, getPos, editor }: any) => {

  const handleSwapNextClick = () => {
    const pos = getPos(); // 現在のノードの位置を取得
    const currentNode = editor.state.doc.nodeAt(pos);
    const nextNode = editor.state.doc.nodeAt(pos + currentNode.nodeSize);
    swapNodes(editor, pos, pos + currentNode.nodeSize)
  };

  const handleSwapPreviousClick = () => {
    const pos = getPos(); // 現在のノードの位置を取得
    const currentNode = editor.state.doc.nodeAt(pos);
    const prevNode = editor.state.doc.childBefore(pos).node;
    const node = editor.state.doc.nodeAt(pos - prevNode.nodeSize);
    //console.log(node)
    swapNodes(editor, pos - prevNode.nodeSize, pos)
  };

  const speakerContent = node.child(0)?.textContent || '';
  const speechContent = node.child(1)?.textContent || '';


  return (
    <NodeViewWrapper data-drag-handle>
      <Box
        draggable="true"
        p={8}
        pt={6}
        display="flex"
        alignItems="center"
        cursor="pointer"
      >
        <FaGripHorizontal size="16" />
        <NodeViewContent className="serif h-full " style={{ whiteSpace: 'normal' }} /> {/* Adjust margin-top to the height of the buttons */}
      </Box>
    </NodeViewWrapper>
  )
}

function swapNodes(editor: Editor, posA: number, posB: number) {
  const { tr, doc } = editor.state;

  const nodeA = doc.nodeAt(posA);
  const nodeB = doc.nodeAt(posB);

  if (!nodeA || !nodeB) {
    return; // ノードが見つからない場合は何もしない
  }

  // ノードAとBのサイズを取得
  const sizeA = nodeA.nodeSize;
  const sizeB = nodeB.nodeSize;

  // ノードAとBの位置を修正（削除後の位置調整）
  const newPosA = posA > posB ? posA - sizeB : posA;
  const newPosB = posB > posA ? posB - sizeA : posB;

  // まずノードAとBを削除
  tr.delete(newPosA, newPosA + sizeA);
  tr.delete(newPosB, newPosB + sizeB);

  // 次にノードBとAを逆の位置に挿入
  tr.insert(newPosB, nodeA.type.create(nodeA.attrs, nodeA.content, nodeA.marks));
  tr.insert(newPosA, nodeB.type.create(nodeB.attrs, nodeB.content, nodeB.marks));

  // トランザクションを実行してノードを入れ替える
  editor.view.dispatch(tr)
}
