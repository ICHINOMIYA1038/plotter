import { Node } from '@tiptap/core';

export const Characters = Node.create({
    name: 'characters',

    group: "block",

    content: 'heading characterItem+',

    parseHTML() {
        return [
            {
                tag: 'div.characters',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", { ...HTMLAttributes, class: 'characters' }, 0];;
    }
});

export const CharacterItem = Node.create({
    name: 'characterItem',

    group: "characterItemGroup", // このグループは `Characters` ノード内でのみ有効

    content: 'characterName characterDetail',

    parseHTML() {
        return [
            {
                tag: 'div.characterItem',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", { ...HTMLAttributes, class: 'characterItem' }, 0];
    }
});

export const CharacterName = Node.create({
    name: 'characterName',

    group: "characterItemContent", // 'CharacterItem' ノード内でのみ有効

    content: 'inline*',

    parseHTML() {
        return [
            {
                tag: 'p.characterName',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['p', { ...HTMLAttributes, class: 'characterName' }, 0];
    },
});

export const CharacterDetail = Node.create({
    name: 'characterDetail',

    group: "characterItemContent", // 'CharacterItem' ノード内でのみ有効

    content: 'inline*',

    parseHTML() {
        return [
            {
                tag: 'p.characterDetail',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['p', { ...HTMLAttributes, class: 'characterDetail' }, 0];
    },
});
