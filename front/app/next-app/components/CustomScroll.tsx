export const scrollToRightOfChild = (parentDivRef) => {
    const parentDiv = parentDivRef.current;
    if (parentDiv) {
        // 目的の子要素を特定するセレクタを使用
        const targetDiv = parentDiv.querySelector('.tiptap');
        if (targetDiv) {
            targetDiv.scrollLeft = targetDiv.scrollWidth - targetDiv.clientWidth;
        }
    }
};

export const scrollToLeftEndOfChild = (parentDivRef) => {
    const parentDiv = parentDivRef.current;
    if (parentDiv) {
        // 目的の子要素を特定するセレクタを使用
        const targetDiv = parentDiv.querySelector('.tiptap');
        if (targetDiv) {
            targetDiv.scrollLeft = -targetDiv.scrollWidth;
        }
    }
};

export const ScrollToLeftBy = (parentDivRef, amount) => {
    const parentDiv = parentDivRef.current;
    if (parentDiv) {
        // 目的の子要素を特定するセレクタを使用
        const targetDiv = parentDiv.querySelector('.tiptap');
        if (targetDiv) {
            targetDiv.scrollLeft -= amount;
        }
    }
};