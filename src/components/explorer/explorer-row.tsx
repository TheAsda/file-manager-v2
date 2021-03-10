import React from 'react';
import cx from 'classnames';
import { FileInfo } from '../../types/file-info';
import { ExplorerCell } from './explorer-cell';
import { Column } from './useColumns';
import styles from './styles.module.css';

export interface ExplorerRowProps {
  columns: Column<FileInfo>[];
  data: FileInfo;
  sizes: number[];
  selected?: boolean;
}

export const ExplorerRow = (props: ExplorerRowProps) => {
  if (props.sizes.length !== props.columns.length) {
    throw new Error('Sizes count are not equal to columns count');
  }

  return (
    <div
      className={cx(
        styles.explorer__row,
        props.selected && styles['explorer__row--selected']
      )}
      style={{
        gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
      }}
    >
      {props.columns.map((col) => (
        <ExplorerCell key={col.header}>
          {typeof col.accessor === 'string'
            ? props.data[col.accessor]
            : col.accessor(props.data)}
        </ExplorerCell>
      ))}
    </div>
  );
};
