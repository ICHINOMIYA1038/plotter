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
  <div
      className="absolute  bg-gray-100"
      style={{ width: '1024px', height: '512px', zIndex: -1 }}
    ><img src="/bg.jpg" alt="" className='object-contain'/></div>
      {/* テキスト入力欄 */}
      <div
        ref={textAreaRef}
        className="border border-gray-300 p-2 text-2xl text-black  relative"
        style={{
          writingMode: 'vertical-rl',
          width: '1024px',
          height: '512px',
          textAlign: 'justify',
          letterSpacing: '1em', // 文字の間隔を均等に
          textJustify: 'inter-character', // 日本語文字の均等割り付け
          overflow: 'hidden', // オーバーフローを非表示に
        }}
        contentEditable={true}
        onInput={handleContentChange}
      >
        テキストを入力...
      </div>
    </div>
  );
}
