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
    <div className="flex justify-center items-center h-screen">
      <div
        ref={textAreaRef}
        className="border border-gray-300 p-2 text-2xl text-black bg-white"
        style={{ writingMode: 'vertical-rl',width: '1024px' ,height:"1024px" }}
        contentEditable={true}
        onInput={handleContentChange} // onChange イベントを使用
      >
        テキストを入力...
      </div>
    </div>
  );
}
