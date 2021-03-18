import React, { useEffect, useRef } from 'react';
import { FileInfo } from '../../types/file-info';
import { ExplorerCell } from './explorer-cell';
import { Column } from './useColumns';
import styles from './styles.module.css';

export interface ExplorerRowProps {
  columns: Column<FileInfo>[];
  data: FileInfo;
  sizes: number[];
  selected?: boolean;
  onSelect: () => void;
  onActivate: () => void;
}

export const ExplorerRow = (props: ExplorerRowProps) => {
  if (props.sizes.length !== props.columns.length) {
    throw new Error('Sizes count are not equal to columns count');
  }

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.selected) {
      ref.current?.focus();
    }
  }, [props.selected]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={styles.explorer__row}
      style={{
        gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
      }}
      role="option"
      aria-selected={props.selected}
      tabIndex={0}
      onClick={props.onSelect}
      onDoubleClick={props.onActivate}
      ref={ref}
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
