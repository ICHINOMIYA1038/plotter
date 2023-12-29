import { TextSelection } from "@tiptap/pm/state";
import { findNodePosition } from "../FindNodePosition";
import { Fragment } from "prosemirror-model";
import { Editor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { typeToIcon, typeToJapanese } from "../TypeToJapanese";
import {
  faParagraph,
  faHeading,
  faBook,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ node, editor }: any) => {
  if (!node) {
    return <div></div>;
  }

  const doc = editor.state.doc;
  const nodePos = findNodePosition(doc, node);

  const handleNodeTypeAndLevelChange = (event: any) => {
    const value = event.target.value;
    const [newNodeType, level] = value.split("-");

    if (node.type.name === "serif") {
      // Serifノード自体を変更
      changeNodeType(
        editor,
        nodePos,
        newNodeType,
        node,
        level ? parseInt(level, 10) : null
      );
    } else {
      changeNodeType(
        editor,
        nodePos,
        newNodeType,
        node,
        level ? parseInt(level, 10) : null
      );
    }
  };

  // changeNodeType 関数の更新
  const changeNodeType = (
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

      // Serifノード構造の作成
      const speechContentNode = editor.schema.nodes.paragraph.create(
        { textAlign: "left" },
        editor.schema.text(combinedText)
      );
      const speechContent = editor.schema.nodes.speechContent.create(
        null,
        Fragment.from(speechContentNode)
      );

      // speakerノードは空の状態で作成
      const speakerNode = editor.schema.nodes.speaker.create(
        null,
        Fragment.from(editor.schema.nodes.paragraph.create())
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
      const textNode = editor.schema.text(combinedText);
      const newNode = nodeType.create(
        attrs,
        Fragment.from(textNode),
        oldNode.marks
      );
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

  const renderChildNodes = (childNodes: any, startPos: any) => {
    return childNodes
      .filter((child: any) => child.type.name !== "text")
      .map((child: any, index: any) => (
        <div
          key={index}
          className="child-node mb-4 p-2 bg-gray-100 rounded-lg shadow-sm"
        >
          <p className="font-semibold text-gray-700">
            {typeToJapanese[child.type.name]}</p>
          <p className="text-gray-600">{child.textContent}</p>
        </div>
      ));
  };
  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 mx-2 my-4">
      {/* ノードタイプの変更セレクトボックス */}
      <select
        value={
          node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")
        }
        onChange={(event) => handleNodeTypeAndLevelChange(event)}
      >
        <option value="paragraph">標準</option>
        <option value="heading-1">タイトル</option>
        <option value="heading-2">シーン</option>
        <option value="heading-3">ト書き</option>
        <option value="heading-4">作者名</option>
        <option value="serif">セリフ</option>
        {/* 他のノードタイプのオプションも追加 */}
      </select>
      <div>
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          <FontAwesomeIcon
            icon={typeToIcon[node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")]}
            className="mr-2"
          />
          {typeToJapanese[node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")]}
        </h3>
        <p className="text-gray-600 mb-6">{node.textContent}</p>

        {node.content && node.content.size > 0 && (
          <div>
            {renderChildNodes(node.content.content, node.pos + 1)}
          </div>
        )}
      </div>
    </div >
  );
};

export default Sidebar;
