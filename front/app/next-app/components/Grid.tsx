// Grid.tsx

import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
}

export const Grid = ({ children }: Props) => {
  const rows = [];

  for (let i = 0; i < 20; i++) {
    const cells = [];
    
    for (let j = 0; j < 20; j++) {
      cells.push(
        <div 
          key={j}
          className={clsx('border border-gray-300 w-10 h-10')} 
        />
      );
    }
    
    rows.push(
      <div key={i} className="flex">
        {cells}
      </div>
    );
  }

  return <div className="flex flex-col">{rows}</div>;
};