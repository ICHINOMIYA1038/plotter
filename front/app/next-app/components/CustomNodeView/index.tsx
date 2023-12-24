import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

const CustomNodeView = ({ node, updateAttributes }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleFocus = () => {
    setMenuVisible(true);
  };

  const handleChangeType = (newType) => {
    // ノードタイプを更新するロジック
    updateAttributes({ type: newType });
    setMenuVisible(false);
  };

  return (
    <NodeViewWrapper>
      <div onFocus={handleFocus}>
        <NodeViewContent as="div" />
        {menuVisible && (
          <div className="node-menu">
            {/* メニューの内容 */}
            <button onClick={() => handleChangeType("paragraph")}>
              Paragraph
            </button>
            <button onClick={() => handleChangeType("heading")}>Heading</button>
            {/* 他のタイプのボタンも同様に追加 */}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
