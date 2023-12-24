const Sidebar = ({ node }) => {
  return (
    <div className="sidebar fixed top-0 right-0 w-64 h-screen bg-gray-200 p-4">
      <div>
        <h3 className="font-bold">Node Information</h3>
        <p>Type: {node.type}</p>
        <p>Content: {node.content}</p>
        <button className="p-2 m-1 border" onClick={makeBold}>
          Bold
        </button>
        <button className="p-2 m-1 border" onClick={makeItalic}>
          Italic
        </button>
        <textarea
          className="w-full h-32 p-2 border"
          value={node.content}
          onChange={handleContentChange}
        />
        <p>Character Count: {node.content.length}</p>
      </div>
    </div>
  );
};

export default Sidebar;
