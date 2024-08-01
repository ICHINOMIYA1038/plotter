import { useState } from "react";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';



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

  const maxWidth = 800;

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 mx-2 my-4 flex items-center justify-center">
        <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg text-lg" onClick={toggleSlideShow}>概要・使い方 <FontAwesomeIcon icon={faChalkboardTeacher} /></button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={toggleSlideShow}>
          <div className="relative p-10" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`/editor/img/howto/${howtoImages[currentSlide]}`}
              alt="How to use"
              width={maxWidth}
              height={maxWidth} // この値はアスペクト比に基づいて調整することができます
              objectFit="contain"
              className="object-contain"
            />
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg text-lg"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg text-lg"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <div>
              {howtoImages.map((_, index) => (
                <span key={index} className={index === currentSlide ? "text-white" : "text-gray-400"}>
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