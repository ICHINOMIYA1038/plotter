import { Editor } from "@tiptap/react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faStrikethrough, faLink, faUndo, faRedo, faPalette, faTimes, faHighlighter, faFont, faTrash } from "@fortawesome/free-solid-svg-icons";

export const Toolbar = ({ editor }: { editor: Editor }) => {
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [textColor, setTextColor] = useState("#000000");
    const [highlightColor, setHighlightColor] = useState("#FFFF00");

    const toggleTextColorPicker = () => {
        setShowTextColorPicker(!showTextColorPicker);
        if (showHighlightColorPicker) setShowHighlightColorPicker(false);
    };

    const toggleHighlightColorPicker = () => {
        setShowHighlightColorPicker(!showHighlightColorPicker);
        if (showTextColorPicker) setShowTextColorPicker(false);
    };

    const clearAllContent = () => {
        if (window.confirm("本当に全ての内容を削除しますか？")) {
            editor.commands.clearContent();
            localStorage.setItem("editor-json-content", "");
        }
    };



    if (!editor) {
        return null;
    }

    return (
        <div className="flex h-15vh bg-white shadow-lg rounded-lg border border-gray-200 px-4 py-2 mx-2 mb-2 items-center justify-end">
            <div className="flex gap-2">
                {/* Bold Button */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`btn ${editor.isActive("bold") ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>

                {/* Strike Button */}
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`btn ${editor.isActive("strike") ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faStrikethrough} />
                </button>

                {/* Link Button */}
                <button
                    onClick={() => {
                        if (editor.isActive("link")) {
                            editor.chain().focus().unsetLink().run();
                        } else {
                            const url: any = window.prompt("URL");
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`btn ${editor.isActive("link") ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faLink} />
                </button>

                {/* Undo Button */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className={`btn ${editor.can().undo() ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>

                {/* Redo Button */}
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className={`btn ${editor.can().redo() ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faRedo} />
                </button>


                <button
                    onClick={clearAllContent}
                    className="btn-red"
                >
                    <FontAwesomeIcon icon={faTrash} /> {/* You can choose an appropriate icon */}
                </button>


                {/* Text Color Picker Trigger Button */}
                <button
                    onClick={toggleTextColorPicker}
                    className={`btn ${showTextColorPicker ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faFont} />
                </button>

                {/* Text Color Picker */}
                {showTextColorPicker && (
                    <div className="absolute top-10 right-0 z-10 rounded">
                        <SketchPicker
                            color={textColor}
                            onChangeComplete={(color) => {
                                setTextColor(color.hex);
                                editor
                                    .chain()
                                    .focus()
                                    .setMark("textStyle", { color: color.hex })
                                    .run();
                            }}
                        />
                        <button onClick={() => setShowTextColorPicker(false)} className="btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                )}

                {/* Highlight Color Picker Trigger Button */}
                <button
                    onClick={toggleHighlightColorPicker}
                    className={`btn ${showHighlightColorPicker ? "btn-active" : ""}`}
                >
                    <FontAwesomeIcon icon={faHighlighter} />
                </button>

                {/* Highlight Color Picker */}
                {showHighlightColorPicker && (
                    <div className="absolute top-10 right-2 z-10 rounded">
                        <SketchPicker
                            color={highlightColor}
                            onChangeComplete={(color) => {
                                setHighlightColor(color.hex);
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHighlight({ color: color.hex })
                                    .run();
                            }}
                        />
                        <button onClick={() => setShowHighlightColorPicker(false)} className="btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
