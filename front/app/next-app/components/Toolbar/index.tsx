import { Editor } from "@tiptap/react";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faStrikethrough, faLink, faUndo, faRedo, faPalette, faTimes } from "@fortawesome/free-solid-svg-icons";

export const Toolbar = ({ editor }: { editor: Editor }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState("#000000");

    if (!editor) {
        return null;
    }

    return (
        <div className="flex h-15vh bg-white shadow-lg rounded-lg border border-gray-200 px-4 py-2 mx-2 my-2 items-center justify-end">
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


                <div className="relative">
                    {/* カラーピッカートリガーボタン */}
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={`btn ${showColorPicker ? "btn-active" : ""}`}
                    >
                        <FontAwesomeIcon icon={faPalette} />
                    </button>
                    {/* カラーピッカー */}
                    {showColorPicker && (
                        <div className="absolute top-10 right-0 z-10 bg-white shadow p-2 rounded">
                            <SketchPicker
                                color={color}
                                onChangeComplete={(color) => {
                                    setColor(color.hex);
                                    editor
                                        .chain()
                                        .focus()
                                        .setMark("textStyle", { color: color.hex })
                                        .run();
                                }}
                            />
                            <button onClick={() => setShowColorPicker(false)} className="btn">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
