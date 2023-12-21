import { useRef, useState, useEffect } from 'react';
import { Rampart_One,Roboto } from "next/font/google";

const RampartOneFont = Rampart_One({
  weight: "400",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})


export default function Home() {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('');
  const [imageW, setImageW] = useState<string>(''); // 画像サイズの状態を追加
  const [imageH, setImageH] = useState<string>(''); // 画像サイズの状態を追加

  const handleContentChange = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const content = textArea.innerHTML;

      setText(content);
    }
  };


  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      // 画面サイズに基づいて画像サイズを設定
      if (windowWidth >= 1200) {
        setImageW('1200px');
        setImageH('900px')
      } else if (windowWidth >= 800) {
        setImageW('800px');
        setImageH('600px')
      } else {
        setImageW('400px');
        setImageH('300px')
      }
    };

    // 初回のレンダリング時とウィンドウのリサイズ時にイベントリスナーを追加
    handleResize();
    window.addEventListener('resize', handleResize);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空の依存リストは初回のみ実行することを保証します

  return (
    <div className={roboto.className}>
    <div className="flex  h-screen relative">
      <div className="absolute bg-gray-100 w-full h-full">
        <img src="/bg-01.jpg" alt="" className="object-contain" style={{ width: imageW, height: 'auto' }} />
      </div>
      {/* テキスト入力欄 */}
      <div
  ref={textAreaRef}
  className="border border-gray-300 text-black relative"
  style={{
    paddingRight: '103px',
    paddingTop: '98px',
    paddingBottom: '75px',
    writingMode: 'vertical-rl',
    textOrientation: "upright",
    fontSize: '16px', // フォントサイズの指定
    width: imageW,
    height: imageH,
    textAlign: 'justify',
    letterSpacing: '20.2px',
    lineHeight:'48px',
    textJustify: 'inter-character',
    overflow: 'hidden',
    fontFamily: 'MS Gothic', // 例: 'Courier New', 'monospace'
  }}
  contentEditable={true}
  onInput={handleContentChange}
>
  テキストを入力...
</div>
    </div>
    <div className="flex  h-screen relative">
      <div className="absolute bg-gray-100 w-full h-full">
        <img src="/bg-01.jpg" alt="" className="object-contain" style={{ width: imageW, height: 'auto' }} />
      </div>
      {/* テキスト入力欄 */}
      <div
  ref={textAreaRef}
  className="border border-gray-300 text-black relative"
  style={{
    paddingRight: '103px',
    paddingTop: '98px',
    paddingBottom: '75px',
    textOrientation: "upright",
    writingMode: 'vertical-rl',
    fontSize: '16px', // フォントサイズの指定
    width: imageW,
    height: imageH,
    textAlign: 'justify',
    letterSpacing: '20.2px',
    lineHeight:'48px',
    textJustify: 'inter-character',
    overflow: 'hidden',
    fontFamily: 'MS Gothic', // 例: 'Courier New', 'monospace'
  }}
  contentEditable={true}
  onInput={handleContentChange}
>
  テキストを入力...
</div>
    </div>
    </div>
  );
}