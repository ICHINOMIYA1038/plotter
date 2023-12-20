import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import React from "react";
import styled from "styled-components";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Node } from "@tiptap/core";

const PageBreak = Node.create({
  name: "pageBreak",

  // ノードがインライン要素かブロック要素かを定義
  inline: false,

  // エディタ内でどのようにレンダリングされるか
  group: "block",

  // コンテンツを持てるかどうか
  content: "inline*",

  // このノードがどこに挿入できるか
  selectable: false,

  // パース時とレンダリング時のHTML表現
  parseHTML() {
    return [
      {
        tag: "div.page-break",
      },
    ];
  },

  // エディタからHTMLへの変換方法
  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "page-break" }, 0];
  },

  // コマンドの定義（任意）
  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent('<div class="page-break"></div>');
        },
    };
  },
});

export default function Home({
  setData,
  data,
  setContent,
  setPreview,
  preview,
}: any) {
  const handleData = (e: any) => {
    if (e.target.name === "title") {
      setData({ ...data, title: e.target.value });
    }
    if (e.target.name === "tags") {
      let tags = e.target.value.split(" ");
      setData({ ...data, tags });
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      PageBreak,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      // Default TableCell
      // TableCell,
      // Custom TableCell with backgroundColor attribute
      CustomTableCell,
    ],
    content: content,
    onBlur: ({ editor }: any) => {
      setContent({
        content: editor.getHTML(),
      });
    },
  });
  console.log(editor?.getJSON());

  return (
    <div>
      <MenuBar editor={editor} />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            italic
          </button>
          <button
            onClick={() => editor.commands.setPageBreak()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            strike
          </button>
        </BubbleMenu>
      )}
      <div className="mx-auto ">
        <EditorContent
          editor={editor}
          className="p-4 min-w-xl min-h-xl mx-auto"
        />
      </div>
    </div>
  );
}

const content = `
<h1>
  人形の舞
</h1>
<h4>
    いちのみや
</h4>
<h5>
    登場人物
    <li>山田</li>
    <li>田中</li>
    <li>佐藤</li>
    <li>鈴木</li>
</h5>
<h3>パッヘルベルのカノンが流れるとともにだんだんと明るくなる。</h3>
<h2>Act1</h2>
<h6>声</h6>
<p>卒業証書授与されるもの</p>

<h6>声</h6>
<p>卒業証書授与されるもの</p>
<h6>声</h6>
<p>卒業証書授与されるもの</p>
<div class="page-break">aa</div>
<p>卒業証書授与されるもの</p>

<h6>声</h6>
<p>卒業証書授与されるもの</p>
<h6>声</h6>
<p>卒業証書授与されるもの</p>
`;

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export const tableHTML = `
  <table style="width:100%">
    <tr>
      <th>Firstname</th>
      <th>Lastname</th>
      <th>Age</th>
    </tr>
    <tr>
      <td>Jill</td>
      <td>Smith</td>
      <td>50</td>
    </tr>
    <tr>
      <td>Eve</td>
      <td>Jackson</td>
      <td>94</td>
    </tr>
    <tr>
      <td>John</td>
      <td>Doe</td>
      <td>80</td>
    </tr>
  </table>
`;

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
      >
        insertTable
      </button>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent(tableHTML, {
              parseOptions: {
                preserveWhitespace: false,
              },
            })
            .run()
        }
      >
        insertHTMLTable
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
      >
        addColumnBefore
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      >
        addColumnAfter
      </button>
      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
      >
        deleteColumn
      </button>
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
      >
        addRowBefore
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      >
        addRowAfter
      </button>
      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
      >
        deleteRow
      </button>
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      >
        deleteTable
      </button>
      <button
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
      >
        mergeCells
      </button>
      <button
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
      >
        splitCell
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
        disabled={!editor.can().toggleHeaderColumn()}
      >
        toggleHeaderColumn
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        disabled={!editor.can().toggleHeaderRow()}
      >
        toggleHeaderRow
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
        disabled={!editor.can().toggleHeaderCell()}
      >
        toggleHeaderCell
      </button>
      <button
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
        disabled={!editor.can().mergeOrSplit()}
      >
        mergeOrSplit
      </button>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setCellAttribute("backgroundColor", "#FAF594")
            .run()
        }
        disabled={!editor.can().setCellAttribute("backgroundColor", "#FAF594")}
      >
        setCellAttribute
      </button>
      <button
        onClick={() => editor.chain().focus().fixTables().run()}
        disabled={!editor.can().fixTables()}
      >
        fixTables
      </button>
      <button
        onClick={() => editor.chain().focus().goToNextCell().run()}
        disabled={!editor.can().goToNextCell()}
      >
        goToNextCell
      </button>
      <button
        onClick={() => editor.chain().focus().goToPreviousCell().run()}
        disabled={!editor.can().goToPreviousCell()}
      >
        goToPreviousCell
      </button>
    </>
  );
};
