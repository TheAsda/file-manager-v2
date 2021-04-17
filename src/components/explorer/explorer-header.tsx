import React from 'react';
import { FileInfo } from '../../types/file-info';
import { Column, ColumnKey } from './useColumns';
import { ExplorerHeaderCell } from './explorer-header-cell';

export interface ExplorerHeaderProps {
  columns: Column<FileInfo>[];
  sizes: number[];
  onSort: (key: ColumnKey) => void;
}

export const ExplorerHeader = ({
  columns,
  sizes,
  onSort,
}: ExplorerHeaderProps) => {
  if (columns.length !== sizes.length) {
    throw new Error('Sizes count are not equal to columns count');
  }

  return (
    <div
      className="grid sticky top-0 bg-black"
      style={{
        gridTemplateColumns: sizes.map((item) => `${item}px`).join(' '),
      }}
    >
      {columns.map((col) => (
        <ExplorerHeaderCell
          className="font-bold"
          key={col.header}
          sort={col.sort}
          onSort={() => onSort(col.key)}
        >
          {col.header}
        </ExplorerHeaderCell>
      ))}
    </div>
  );
};
