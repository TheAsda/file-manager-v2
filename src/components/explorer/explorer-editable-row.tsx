import React, { useState } from 'react';
import { FileInfo } from '../../types/file-info';
import { ExplorerCell } from './explorer-cell';
import { ExplorerInput } from './explorer-input';
import styles from './styles.module.css';
import { Column } from './useColumns';

export interface ExplorerEditableRowProps {
  columns: Column<FileInfo>[];
  sizes: number[];
}

export const ExplorerEditableRow = (props: ExplorerEditableRowProps) => {
  const [state, setState] = useState<string>('');

  const [, ...columns] = props.columns;

  return (
    <div
      className={styles['explorer__editable-row']}
      style={{
        gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
      }}
    >
      <ExplorerInput value={state} onChange={setState} />
      {columns.map((col) => (
        <ExplorerCell key={col.header} />
      ))}
    </div>
  );
};
