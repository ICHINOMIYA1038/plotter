// components/GridRow.tsx
import React from 'react';
import GridCell from '@/components/grid_cell';

interface GridRowProps {
  rowContent: string[];
  onCellChange: (rowIndex: number, cellIndex: number, content: string) => void;
}

const GridRow: React.FC<GridRowProps> = ({ rowContent, onCellChange }) => {
  return (
    <div className="flex items-center space-x-2">
      {rowContent.map((content, cellIndex) => (
        <GridCell
          key={cellIndex}
          content={content}
          onChange={(newContent) => onCellChange(0, cellIndex, newContent)}
        />
      ))}
    </div>
  );
};

export default GridRow;
