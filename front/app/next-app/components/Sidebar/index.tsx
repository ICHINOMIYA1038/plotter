import { TextSelection } from "@tiptap/pm/state";
import { findNodePosition } from "../FindNodePosition";
import { Fragment } from "prosemirror-model";

const Sidebar = ({ node, editor }) => {
  if (!node) {
    return <div></div>;
  }

  const doc = editor.state.doc;
  const nodePos = findNodePosition(doc, node);

  const handleNodeTypeAndLevelChange = (event) => {
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

  const changeNodeType = (
    editor,
    nodePos,
    newNodeType,
    oldNode,
    level = null
  ) => {
    const attrs = { ...oldNode.attrs };
    if (newNodeType === "heading" && level) {
      attrs.level = level;
    }

    const nodeType = editor.schema.nodes[newNodeType];

    // 子ノードのテキストを結合
    const combinedText = oldNode.content.content
      .map((node) => node.textContent)
      .join("");

    // 新しいノードの作成
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

    // 新しいノードの後ろに選択範囲を設定
    const newSelection = TextSelection.create(
      transaction.doc,
      nodePos + newNode.nodeSize
    );
    transaction = transaction.setSelection(newSelection);

    editor.view.dispatch(transaction);
  };

  const renderChildNodes = (childNodes, startPos) => {
    return childNodes
      .filter((child) => child.type.name !== "text")
      .map((child, index) => (
        <div
          key={index}
          className="child-node mb-4 p-2 bg-gray-100 rounded-lg shadow-sm"
        >
          <p className="font-semibold text-gray-700">Type: {child.type.name}</p>
          <p className="text-gray-600">{child.textContent}</p>
        </div>
      ));
  };

  return (
    <div className="sidebar fixed top-0 right-0 w-64 h-screen bg-white p-4 shadow-lg overflow-y-auto">
      {/* ノードタイプの変更セレクトボックス */}
      <select
        value={
          node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")
        }
        onChange={(event) => handleNodeTypeAndLevelChange(event)}
      >
        <option value="paragraph">Paragraph</option>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <option
            key={level}
            value={`heading-${level}`}
          >{`Heading Level ${level}`}</option>
        ))}
        {/* 他のノードタイプのオプションも追加 */}
      </select>
      <div>
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          Node Information
        </h3>
        <p className="font-semibold text-gray-700">Type: {node.type.name}</p>
        <p className="text-gray-600 mb-6">{node.textContent}</p>

        {node.content && node.content.size > 0 && (
          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-800">
              Child Nodes
            </h4>
            {renderChildNodes(node.content.content, node.pos + 1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
