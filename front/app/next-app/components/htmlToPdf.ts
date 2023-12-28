import { Editor } from "@tiptap/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function splitContentForPrint(content: any, pageWidth: any) {
  const container = document.createElement("div");
  container.innerHTML = content;

  let accumulatedWidth = 0;
  let currentPage = document.createElement("div");

  Array.from(container.childNodes).forEach((node: any) => {
    currentPage.appendChild(node.cloneNode(true));
    accumulatedWidth += node.offsetWidth;

    if (accumulatedWidth >= pageWidth) {
      currentPage.classList.add("page-break");
      accumulatedWidth = 0;
    }
  });

  return currentPage.innerHTML;
}

export const exportToPDF = (editor: Editor) => {
  if (!editor) {
    console.error("Editor instance is not available");
    return;
  }

  const editorContent = editor.getHTML(); // エディタのHTMLコンテンツを取得

  const printWindow = window.open("", "_blank"); // 新しいウィンドウを開く

  if (printWindow) {
    // CSSスタイル
    const cssStyles = `

        .main-container {
            padding: 1rem; 
            min-width: 1200px; 
            min-height: 1200px; 
            margin-left: auto;
            margin-right: auto;
        }
      
      .tiptap {
        box-sizing: border-box;

        margin: 0 auto;
        min-width: 1080px;
        min-height: 760px;
        max-width: 1080px;
        max-height: 760px;
        overflow-x: scroll;
        -webkit-writing-mode: vertical-rl;
        -ms-writing-mode: tb-rl;
        writing-mode: vertical-rl;
        font-size: 20px;
        font-family: "Noto Serif JP", serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-feature-settings: "palt";
        font-feature-settings: "palt";
        color: #2c3e50;
        line-height: 2em;
        -webkit-text-orientation: upright;
        text-orientation: upright;
        border: 4px solid #000000;
        border-radius: 12px;
        box-shadow: inset 0 0 0 2px #000000;
        background-color: #ffffff;
      
        padding-top: 100px;
        padding-right: 30px;
        > * {
          -webkit-writing-mode: vertical-rl;
          -ms-writing-mode: tb-rl;
          writing-mode: vertical-rl;
          font-size: 20px;
          font-family: "Noto Serif JP", serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-feature-settings: "palt";
          font-feature-settings: "palt";
          color: #2c3e50;
          line-height: 2em;
          -webkit-text-orientation: upright;
          text-orientation: upright;
        }
      
        ul {
          list-style-type: disc; /* 通常の点（円盤）スタイルを追加 */
          padding: 0 1rem;
        }
      
        ul,
        ol {
          padding: 0 1rem;
        }
      
        /* タイトル */
        h1 {
          font-size: 2.5rem; /* h1 のフォントサイズを調整 */
      
          margin-top: 5rem;
        }
      
        h2 {
          font-size: 1rem; /* h2 のフォントサイズを調整 */
          margin-top: 8rem;
          font-weight: bold; /* 太字のフォント */
        }
      
        /* */
        h3 {
          font-size: 1.5rem; /* h3 のフォントサイズを調整 */
          font-weight: bold; /* 太字のフォント */
        }
      
        h4 {
          font-size: 1.25rem; /* h4 のフォントサイズを調整 */
          font-weight: bold; /* 太字のフォント */
        }
      
        h5 {
          font-size: 1.1rem; /* h5 のフォントサイズを調整 */
          font-weight: bold; /* 太字のフォント */
        }
      
        /* 作者*/
        h6 {
          text-align: right;
          font-size: 1rem; /* h6 のフォントサイズを調整 */
          margin-bottom: 5rem;
        }
      
        code {
          background-color: rgba(#616161, 0.1);
          color: #616161;
        }
      
        pre {
          background: #0d0d0d;
          color: #fff;
          font-family: "JetBrainsMono", monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
      
          code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
          }
        }
      
        img {
          max-width: 100%;
          height: auto;
        }
      
        blockquote {
          padding-left: 1rem;
          border-left: 2px solid rgba(#0d0d0d, 0.1);
        }
      
        hr {
          border: none;
          border-top: 2px solid rgba(#0d0d0d, 0.1);
          margin: 2rem 0;
        }
      }
      /* 基本的なボタンスタイル */
      .btn {
        @apply bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300;
      }
      
      /* アクティブなボタンのスタイル */
      .btn-active {
        @apply bg-blue-700;
      }
      
      .ProseMirror a {
        color: blue;
        cursor: pointer;
        text-decoration: underline;
      }
      
      .tiptap p.is-empty::before {
        writing-mode: vertical-rl;
        color: #adb5bd;
        content: attr(data-placeholder);
        pointer-events: none;
      }
      
      .has-focus {
        border-radius: 3px;
        box-shadow: 0 0 0 3px #68cef8;
      }
      
      .serif {
        display: flex;
      }
      
      .speechContent {
        flex: 3;
      }
      
      .speaker {
        flex: 1;
      }
      .page-break {
        page-break-after: always;
      }
    `;

    const pageWidth = 800; // ここでページの幅を指定します
    const splitContent = splitContentForPrint(editorContent, pageWidth);

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>${cssStyles}</style>
        </head>
        <body>
        <div class="main-container">
          <div class="tiptap">${splitContent}</div>
        </div>
        </body>
      </html>
    `);

    printWindow.document.close(); // ドキュメントの書き込みを終了
    printWindow.focus(); // 新しいウィンドウにフォーカスを移動
    printWindow.print(); // ブラウザの印刷ダイアログを開く
  } else {
    console.error("Cannot open a new window for printing");
  }
};
