import React from 'react';
import { FileInfo } from '../../types/file-info';
import { Column } from './useColumns';
import { ExplorerCell } from './explorer-cell';

export interface ExplorerHeaderProps {
  columns: Column<FileInfo>[];
  sizes: number[];
}

export const ExplorerHeader = ({ columns, sizes }: ExplorerHeaderProps) => {
  if (columns.length !== sizes.length) {
    throw new Error('Sizes count are not equal to columns count');
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: sizes.map((item) => `${item}px`).join(' '),
      }}
    >
      {columns.map((col) => (
        <ExplorerCell className="font-bold" key={col.header}>
          {col.header}
        </ExplorerCell>
      ))}
    </div>
  );
};
