export function getCharacterList(editor: Editor) {
    const charactersList: any = [];

    // Traverse the editor's content to find 'characters' nodes
    editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'characters') { // Check for 'characters' node
            node.forEach((childNode, childPos) => {
                if (childNode.type.name === 'characterItem') { // Check for 'characterItem' node
                    let character = {
                        name: '',
                        detail: ''
                    };

                    // Traverse the 'characterItem' node to find 'characterName' and 'characterDetail'
                    childNode.forEach((grandChildNode, grandChildPos) => {
                        if (grandChildNode.type.name === 'characterName') {
                            character.name = grandChildNode.textContent;
                        } else if (grandChildNode.type.name === 'characterDetail') {
                            character.detail = grandChildNode.textContent;
                        }
                    });

                    // Add the character to the list
                    charactersList.push(character);
                }
            });
        }
    });

    return charactersList;
}
