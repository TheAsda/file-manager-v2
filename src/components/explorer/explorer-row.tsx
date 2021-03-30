import React from 'react';
import cx from 'classnames';
import { FileInfo } from '../../types/file-info';
import { ExplorerCell } from './explorer-cell';
import { Column } from './useColumns';

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

  return (
    <div
      className={cx(
        'grid hover:bg-gray-500 w-full',
        props.selected && 'bg-gray-600'
      )}
      style={{
        gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
      }}
      role="option"
      aria-selected={props.selected}
      onClick={props.onSelect}
      onDoubleClick={props.onActivate}
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
