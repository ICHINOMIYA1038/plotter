import { useRef, useState, useEffect } from 'react';

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
    <div className="flex  h-screen relative">
      <div className="absolute bg-gray-100 w-full h-full">
        <img src="/bg-01.jpg" alt="" className="object-contain" style={{ width: imageW, height: 'auto' }} />
      </div>
      {/* テキスト入力欄 */}
      <div
        ref={textAreaRef}
        className="border border-gray-300 text-base text-black relative"
        style={{
          paddingRight:'115px',
          paddingTop:'98px',
          writingMode: 'vertical-rl',
          width: imageW, // 画像のサイズに合わせる
          height: imageH, // 画面の高さに合わせる
          textAlign: 'justify',
          letterSpacing: '20px',
          textJustify: 'inter-character',
          overflow: 'hidden',
        }}
        contentEditable={true}
        onInput={handleContentChange}
      >
        テキストを入力...
      </div>
    </div>
  );
}