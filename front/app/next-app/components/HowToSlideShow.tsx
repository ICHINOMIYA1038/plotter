import { useState } from "react";

export default function HowToSlideShow() {
  // 仮定: howtoImages は public/howto ディレクトリの画像ファイル名の配列
  const howtoImages = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % howtoImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (current) => (current - 1 + howtoImages.length) % howtoImages.length
    );
  };

  const toggleSlideShow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleSlideShow}>使い方</button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={toggleSlideShow}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/howto/${howtoImages[currentSlide]}`}
              alt="How to use"
              className="w-full h-full"
            />
            <button onClick={prevSlide}>Prev</button>
            <button onClick={nextSlide}>Next</button>
            <div>
              {howtoImages.map((_, index) => (
                <span
                  key={index}
                  className={
                    index === currentSlide ? "text-white" : "text-gray-400"
                  }
                >
                  &#9679; {/* 丸いインジケーター */}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
