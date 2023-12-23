// CustomNodeComponent.tsx
const CustomNodeComponent = ({ node, updateAttributes }) => {
  // ここで話者名や発言内容を編集するロジックを実装
  return (
    <div className="serif">
      <div className="speaker">話者名</div>
      <div className="speechContent">発言内容</div>
    </div>
  );
};
