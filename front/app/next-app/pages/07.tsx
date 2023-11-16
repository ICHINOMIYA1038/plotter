import { useState, useRef } from 'react';

const YourComponent = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const caretPosition = event.target.selectionStart;

    setInput1(value);
    setInput2(value);

    // 現在のキャレット位置を保持し、後で復元する
    setTimeout(() => {
      input1Ref.current.selectionStart = caretPosition;
      input1Ref.current.selectionEnd = caretPosition;
    }, 0);
  };

  const handleKeyDown = (event) => {
    const value = event.target.value;

    if (event.key === 'Backspace' && value === '' && input1.length > 0) {
      // Backspace キーが押されたとき、かつ input2 の文字がなく、かつ input1 の文字がある場合
      setInput1((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div>
      <input
        ref={input1Ref}
        type="text"
        value={input1}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Input"
      />
      <input
        ref={input2Ref}
        type="text"
        value={input2}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Input"
      />
    </div>
  );
};

export default YourComponent;