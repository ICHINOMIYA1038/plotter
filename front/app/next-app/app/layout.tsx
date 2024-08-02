// app/layout.tsx

import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import * as gtag from "@/lib/gtag";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "戯曲エディタ",
  description: "戯曲エディタは、演劇の脚本を書くことに特化した縦書きのテキストエディタ。演劇の脚本以外でも利用可能",
  keywords: ["戯曲", "演劇", "脚本", "エディタ"],
  authors: [{ name: "戯曲図書館" }],
  openGraph: {
    title: "戯曲エディタ-戯曲図書館",
    description: "戯曲エディタは、演劇の脚本を書くことに特化した縦書きのテキストエディタ。演劇の脚本以外でも利用可能",
    images: ["/img/howto/1.png"],
  },
};

export default function RootLayout({ children }:any) {      
  return (
    <html lang="ja">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8691137965825158"
          crossOrigin="anonymous"
        ></Script>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());

             gtag('config', '${gtag.GA_MEASUREMENT_ID}');
             `,
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}