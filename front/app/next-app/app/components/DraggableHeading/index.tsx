import Heading from "@tiptap/extension-heading";
import {
    mergeAttributes,
    ReactNodeViewRenderer,
    NodeViewContent,
    NodeViewWrapper,
} from "@tiptap/react";
import { Box } from "@kuma-ui/core";

import { FaGripHorizontal } from "react-icons/fa";

function DraggableHeadingNode(props: any) {
    return (
        <NodeViewWrapper data-drag-handle>
            <Box
                draggable="true"
                p={8}
                pt={6}
                display="flex"
                alignItems="center"
                cursor="pointer"
            >
                <FaGripHorizontal size="16" />
                <NodeViewContent className="content" />
            </Box>
        </NodeViewWrapper>
    );
}

export const DraggableHeading = Heading.extend({
    draggable: true,
});
