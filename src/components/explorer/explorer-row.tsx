import React, { useEffect, useRef } from 'react';
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
    <div
      className={cx(
        styles.explorer__row
        // props.selected && styles['explorer__row--selected']
      )}
      style={{
        gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
      }}
      role="option"
      aria-selected={props.selected}
      tabIndex={0}
      onClick={props.onSelect}
      onKeyPress={props.onActivate}
      onKeyDownCapture={(e) => e.key === 'Tab' && e.preventDefault()}
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
