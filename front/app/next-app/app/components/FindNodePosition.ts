export function findNodePosition(doc: any, targetNode: any) {
  let position = null;

  doc.descendants((node: any, pos: any) => {
    if (node === targetNode) {
      position = pos;
      return false; // 走査を停止
    }
  });

  return position;
}
