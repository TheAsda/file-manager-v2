import React from 'react';
import { FileInfo } from '../../types/file-info';
import { Column } from './useColumns';
import styles from './styles.module.css';
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
      className={styles.explorer__header}
      style={{
        gridTemplateColumns: sizes.map((item) => `${item}px`).join(' '),
      }}
    >
      {columns.map((col) => (
        <ExplorerCell
          className={styles['explorer__header-cell']}
          key={col.header}
        >
          {col.header}
        </ExplorerCell>
      ))}
    </div>
  );
};
