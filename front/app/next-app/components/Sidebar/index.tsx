import { TextSelection } from "@tiptap/pm/state";
import { findNodePosition } from "../FindNodePosition";
import { Fragment } from "prosemirror-model";
import { Editor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { typeToIcon, typeToJapanese } from "../TypeToJapanese";
import { changeNodeType } from "../ChangeNodeType";

const Sidebar = ({ node, editor }: any) => {
  if (!node) {
    return <div></div>;
  }

  const doc = editor.state.doc;
  const nodePos = findNodePosition(doc, node);
  const isNotCharacter = node.type.name !== "characters";

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

  const renderChildNodes = (childNodes, startPos) => {
    return childNodes
      .filter(child => child.type.name !== "text" && child.attrs.level != 5 && child.type.name !== "hardBreak")
      .map((child, index) => {
        // 孫ノードの存在を確認
        const hasGrandchildren = child.content.content && child.content.content.length >= 2;

        return (
          hasGrandchildren ? (
            // 孫ノードがある場合、それらのみを表示
            <div key={index} className="child-node mb-4 p-2 bg-gray-100 rounded-lg shadow-sm">
              {child.content.content.map((grandchild, gIndex) => (

                grandchild.content.content[0] && < div key={gIndex} >
                  {grandchild.content.content[0].text}
                </div>

              ))
              }
            </div >
          ) : (
            // 孫ノードがない場合、子ノードを表示
            <div key={index} className="child-node mb-4 p-2 bg-gray-100 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-700">{typeToJapanese[child.type.name]}</p>
              <p className="text-gray-600">{child.textContent}</p>
            </div>
          )
        );
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 mx-2 my-4">
      {/* ノードタイプの変更セレクトボックス */}
      {isNotCharacter && <select
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
      }
      <div>
        <h3 className="font-bold text-xl mb-4 text-gray-800">
          <FontAwesomeIcon
            icon={typeToIcon[node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")]}
            className="mr-2"
          />
          {typeToJapanese[node.type.name + (node.attrs.level ? `-${node.attrs.level}` : "")]}
        </h3>
        {node.type.name !== "serif" && node.type.name !== "characters" ? (
          <p className="text-gray-600 mb-6">{node.textContent}</p>) : (<></>)
        }
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
