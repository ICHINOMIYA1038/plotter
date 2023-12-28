'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from '@/components/MenuBar'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  return (
    <>
        <MenuBar />
        <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap