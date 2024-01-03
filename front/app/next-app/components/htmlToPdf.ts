import { Editor } from "@tiptap/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const handlePDF = async (
  html: any,
  css: any,
  pageWidth: any,
  title = "戯曲エディタ"
) => {
  const newHtmlContent = splitPagesAndReconstruct(html, css, pageWidth);

  const printWindow = window.open(title, "_blank"); // 新しいウィンドウを開く

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);

    printWindow.document.close(); // ドキュメントの書き込みを終了
    printWindow.focus(); // 新しいウィンドウにフォーカスを移動
    printWindow.print(); // ブラウザの印刷ダイアログを開く
    printWindow.close();
  } else {
    console.error("Cannot open a new window for printing");
  }
};

export const exportToPDF = (editor: Editor) => {
  if (!editor) {
    console.error("Editor instance is not available");
    return;
  }

  const editorContent = editor.getHTML();

  const cssContent = `
    body {
        overflow-wrap: break-word;
        margin: 0 auto;
        overflow-x: scroll;
        -webkit-writing-mode: vertical-rl;
        writing-mode: vertical-rl;
        line-height: 2em;
        -webkit-text-orientation: upright;
        text-orientation: upright;
        padding-top: 80px;
        padding-bottom: 80px;
        padding-right: 20px;
        padding-left: 100px;
    }
    .page-break {
        page-break-before: always; /* 印刷時にページ分割 */
    }
    /* タイトル */
    h1 {
      font-size: 1.8rem;
      /* h1 のフォントサイズを調整 */
      font-weight: bold;
      padding-top: 5rem;
    }
  
    h2 {
      font-size: 1.3rem;
      /* h2 のフォントサイズを調整 */
      font-weight: bold;
      padding-top: 2rem;
      /* 太字のフォント */
    }
  
    /* */
    h3 {
      font-size: 1rem;
      /* h3 のフォントサイズを調整 */
      font-weight: bold;
      /* 太字のフォント */
      padding-top: 8rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  
    h4 {
      font-size: 0.8rem;
      /* h4 のフォントサイズを調整 */
      padding-bottom: 5rem;
      text-align: right;
      font-weight: bold;
      /* 太字のフォント */
    }
  
    h5 {
      font-size: 1.1rem;
      /* h5 のフォントサイズを調整 */
      font-weight: bold;
      /* 太字のフォント */
    }
  
    /* 作者*/
    h6 {
      text-align: right;
      font-size: 1rem;
      /* h6 のフォントサイズを調整 */
      padding-bottom: 5rem;
    }

    .serif {
        display: flex;
      }
      
      .speechContent {
        height: 80%;
        padding-top: 5%;
      }

.speaker {
    height: 10%;
    padding-top: 5%;
  }
  
  .characterItem {
    display: flex;
  }
  
  .characterDetail {
    height: 75%;
    padding-top: 5%;
  }
  
  .characterName {
    height: 25%;
    padding-top: 1%;
  }
  
  .characters {
    padding-top: 5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    font-size: 0.9rem;
  }
    `;

  handlePDF(editorContent, cssContent, 1000);
  // エディタのHTMLコンテンツを取得
};

function splitPagesAndReconstruct(
  htmlContent: any,
  cssContent: any,
  pageWidth: any
) {
  // 新しいdiv要素を作成して、与えられたHTMLとCSSを適用
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  const style = document.createElement("style");
  style.innerHTML = cssContent;
  document.head.appendChild(style);

  let currentPageContent = "";
  let currentWidth = 0;

  // コンテナ内の要素を反復処理
  Array.from(container.childNodes).forEach((node: any) => {
    // 仮のdivを作成し、現在のノードを追加して幅を計算
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "inline-block"; // ブロックレベル要素の幅を正確に計算
    tempDiv.appendChild(node.cloneNode(true));
    document.body.appendChild(tempDiv);

    const nodeWidth = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);

    console.log(currentWidth);

    // 現在のページの横幅を確認
    if (currentWidth + nodeWidth > pageWidth) {
      // ページ分割ポイントに到達
      currentPageContent += '<div class="page-break"></div>';
      currentWidth = 0;
    }

    // 現在のページ内容にノードを追加し、幅を更新
    currentPageContent += node.outerHTML;
    currentWidth += nodeWidth;
  });

  // スタイル要素を削除
  document.head.removeChild(style);

  console.log(currentPageContent);

  // 分割されたページを含むHTMLを返す
  return currentPageContent;
}
