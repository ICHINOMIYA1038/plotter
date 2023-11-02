// components/GridPaper.tsx
import React, { useState } from 'react';
import GridRow from '@/components/grid_row';

const initialContent = Array.from({ length: 20 }, () => '');

const GridPaper: React.FC = () => {
  const [paperContent, setPaperContent] = useState(initialContent);

  const handleCellChange = (rowIndex: number, cellIndex: number, content: string) => {
    const updatedContent = [...paperContent];
    updatedContent[rowIndex] = updatedContent[rowIndex].split('');
    updatedContent[rowIndex][cellIndex] = content;
    updatedContent[rowIndex] = updatedContent[rowIndex].join('');
    setPaperContent(updatedContent);
  };

  return (
    <div className="flex flex-col w-full space-y-2">
      {paperContent.map((rowContent, rowIndex) => (
        <GridRow
          key={rowIndex}
          rowContent={rowContent.split('')}
          onCellChange={(cellIndex, content) => handleCellChange(rowIndex, cellIndex, content)}
        />
      ))}
    </div>
  );
};

export default GridPaper;
