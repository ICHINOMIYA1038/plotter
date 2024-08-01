"use client";

import Tiptap from "@/app/components/tiptap";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
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
