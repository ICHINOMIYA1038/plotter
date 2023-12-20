import React, { useState, useEffect, useRef } from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div>
      {Array.from({ length: totalPages }, (_, index) => (
        <button key={index} onClick={() => setCurrentPage(index)}>
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageContents, setPageContents] = useState([]);
  const maxHeight = 300; // 最大高さ（ピクセル単位）

  useEffect(() => {
    if (containerRef.current) {
      const children = Array.from(containerRef.current.children);
      let totalHeight = 0;
      let currentPageContent = [];
      let allPagesContent = [];

      children.forEach((child) => {
        totalHeight += child.offsetHeight;
        if (totalHeight > maxHeight && currentPageContent.length > 0) {
          allPagesContent.push([...currentPageContent]);
          currentPageContent = [];
          totalHeight = child.offsetHeight;
        }
        currentPageContent.push(child);
      });

      // 最後のページを追加
      if (currentPageContent.length > 0) {
        allPagesContent.push([...currentPageContent]);
      }

      setPageContents(allPagesContent);
      setTotalPages(allPagesContent.length);

      // 各ページネーションされたDOM要素をコンソールに表示
      allPagesContent.forEach((page, pageIndex) => {
        console.log(`Page ${pageIndex + 1} contents:`);
        page.forEach((content, contentIndex) => {
          console.log(`Content ${contentIndex + 1}:`, content);
        });
      });
    }
  }, []);

  return (
    <div>
      <div ref={containerRef}>
        <div>Content 1</div>
        <div>Content 2</div>
        <div>Content 3</div>
        <div>Content 4</div>
        <div>Content 5</div>
        <div>Content 6</div>
        <div>Content 7</div>
        <div>Content 8</div>
        <div>Content 9</div>
        <div>Content 10</div>
        <div>Content 11</div>
        <div>Content 12</div>
        <div>Content 13</div>
        <div>Content 14</div>
        <div>Content 15</div>
        <div>Content 16</div>
        <div>Content 17</div>
        <div>Content 18</div>
        <div>Content 19</div>
        <div>Content 20</div>
        <div>Content 21</div>
        <div>Content 22</div>
        <div>Content 23</div>
        <div>Content 24</div>
        <div>Content 25</div>
        <div>Content 26</div>
        <div>Content 27</div>
        <div>Content 28</div>
        <div>Content 29</div>
        <div>Content 30</div>
        {/* その他のコンテンツ */}
      </div>

      {pageContents.map((page, index) => (
        <div
          key={index}
          style={{ display: index === currentPage ? "block" : "none" }}
        >
          {page.map((content, contentIndex) => (
            <div key={contentIndex}>{content.innerHTML}</div>
          ))}
        </div>
      ))}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
