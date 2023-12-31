import Placeholder from "@tiptap/extension-placeholder";

export const customPlaceholder = Placeholder.configure({
    showPlaceholder: ({ editor, node }) => {
        if ((node.type.name === 'speaker' || node.type.name === 'speechContent') && node.content.size === 0) {
            // ノードが空の場合、is-empty クラスを追加
            const dom = editor.view.nodeDOM(node.pos);
            if (dom && dom instanceof HTMLElement) {
                dom.classList.add('is-empty');
            }
            return 'カスタムプレースホルダーテキスト'; // ここに適切なプレースホルダーテキストを設定
        }
        return false; // 他のノードにはプレースホルダーを表示しない
    },
});
