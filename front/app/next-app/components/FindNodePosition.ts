export function findNodePosition(doc, targetNode) {
  let position = null;

  doc.descendants((node, pos) => {
    if (node === targetNode) {
      position = pos;
      return false; // 走査を停止
    }
  });

  return position;
}
