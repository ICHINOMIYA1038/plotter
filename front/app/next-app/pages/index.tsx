import Tiptap from "@/components/tiptap";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [data, setData] = useState("");
  const [isScreenLarge, setIsScreenLarge] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行されるため、ここでwindowオブジェクトを安全に使用できる
    const checkScreenSize = () => {
      setIsScreenLarge(window.innerWidth > 800);
    };

    checkScreenSize();

    const handleResize = () => {
      checkScreenSize();
    };

    const handleWheel = (e: any) => {
      if (e.deltaY === 0) return;
      window.scrollBy({ left: e.deltaY, behavior: "smooth" });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <Head>
        <title>戯曲エディタ</title>
        <meta
          name="description"
          content="戯曲エディタは、演劇の脚本を書くことに特化した縦書きのテキストエディタ。演劇の脚本以外でも利用可能"
        />
        {/* その他のSEOに関連するタグ */}
        <meta name="keywords" content="戯曲 演劇 脚本 エディタ" />
        <meta name="author" content="戯曲図書館" />
        {/* ソーシャルメディアでの共有のためのタグ */}
        <meta property="og:title" content="戯曲エディタ-戯曲図書館" />
        <meta
          property="og:description"
          content="戯曲エディタは、演劇の脚本を書くことに特化した縦書きのテキストエディタ。演劇の脚本以外でも利用可能"
        />
        <meta property="og:image" content="/img/howto/1.png" />
      </Head>
      <div>
        {isScreenLarge ? (
          <Tiptap setContent={setContent} />
        ) : (
          <div className="flex justify-center text-3xl font-bold items-center bg-white shadow-lg">
            <p>
              このアプリに必要な画面サイズがありません。パソコンでご覧ください。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
