import { useRef, useState } from 'react';

export default function Home() {
  const textAreaRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>(''); // 状態を追加

  const handleContentChange = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      const content = textArea.innerHTML;
      setText(content); // 状態を更新
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="absolute bg-gray-100 w-full h-full">
        <img src="/bg.jpg" alt="" className="object-contain" />
      </div>
      {/* テキスト入力欄 */}
      <div
        ref={textAreaRef}
        className="border border-gray-300 p-14 text-xs text-black relative"
        style={{
          writingMode: 'vertical-rl',
          width: '100%', // 画像の幅に合わせる
          height: '100%', // 画像の高さに合わせる
          textAlign: 'justify',
          letterSpacing: '0.5em',
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
