// pages/api/convert-pdf.js
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { html, css, pageWidth } = req.body;

      // Puppeteerを使ってPDFを生成
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // 分割されたHTMLにCSSを適用
      const fullHtml = `<style>${css}</style>${html}`;
      await page.setContent(fullHtml, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
      });

      await browser.close();

      // PDFをバイナリデータとして返す
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "っっっh" });
    }
  } else {
    res.status(405).json({ message: "許可されていないメソッドです" });
  }
}
