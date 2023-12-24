const Sidebar = ({ node }) => {
  console.log(node);
  //nodeがnullの場合は空のdivを返す
  if (!node) {
    return <div></div>;
  } else {
    return (
      <div className="sidebar fixed top-0 right-0 w-64 h-screen bg-gray-200 p-4">
        <div>
          <h3 className="font-bold">Node Information</h3>
          <p>Type: {node.type.name}</p>
          <p>Content: {node.text}</p>
        </div>
      </div>
    );
  }
};

export default Sidebar;
