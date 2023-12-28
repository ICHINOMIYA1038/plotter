import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { FaBold, FaCode } from 'react-icons/fa'; // "bold" アイコンをインポート
import { FaItalic } from 'react-icons/fa';
import { FaStrikethrough } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaRedo } from 'react-icons/fa'; 


const MenuBar = () => {
  const { editor } = useCurrentEditor()
  console.log(editor.getJSON()  )

  if (!editor) {
    return null
  }

  return (
    <>
<button
  onClick={() => editor.chain().focus().toggleBold().run()}
  disabled={
    !editor.can()
      .chain()
      .focus()
      .toggleBold()
      .run()
  }
  className={`custom-button ${editor.isActive('bold') ? 'is-active' : ''}`}
>
  Bold
</button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={`custom-button ${editor.isActive('italic') ? 'is-active' : ''}`}
      >
        <FaItalic/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={`custom-button ${editor.isActive('strike') ? 'is-active' : ''}`}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={`custom-button ${editor.isActive('code') ? 'is-active' : ''}`}
      >
        <FaCode />
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`custom-button ${editor.isActive('paragraph') ? 'is-active' : ''}`}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}`}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`custom-button ${editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}`}
      >
        h6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`custom-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`custom-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`custom-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`custom-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={`custom-button ${editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}`}
      >
        purple
      </button>
    </>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

export default () => {
  return (
    <div className = "max-w-md mx-auto">
    <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider>
    </div>
  )
}