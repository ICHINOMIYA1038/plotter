// components/GridCell.tsx
import React from 'react';

interface GridCellProps {
  content: string;
  onChange: (content: string) => void;
}

const GridCell: React.FC<GridCellProps> = ({ content, onChange }) => {
  return (
    <div className="border border-gray-300 w-12 h-12 p-2 text-lg leading-8 text-center">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full text-center bg-transparent border-none outline-none"
        style={{ writingMode: 'vertical-rl', resize: 'none' }}
      />
    </div>
  );
};

export default GridCell;
