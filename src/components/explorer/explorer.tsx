import { log } from 'electron-log';
import React, { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { isDev } from '../../config';
import { useColumns } from './useColumns';
import { FileInfo } from '../../types/file-info';
import styles from './styles.module.css';
import { ExplorerRow } from './explorer-row';
import { ExplorerHeader } from './explorer-header';
import { ExplorerEditableRow } from './explorer-editable-row';

export interface ExplorerProps {
  data: FileInfo[];
  selected: number | null;
  onSelect: (index: number) => void;
  onActivate: (index: number) => void;
  editable: number | null;
  isNew?: boolean;
}

export const Explorer = (props: ExplorerProps) => {
  if (isDev) {
    log('Explorer rendered');
  }

  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const columns = useColumns();

  const [columnsSizes, setColumnsSizes] = useState(
    Array.from(Array(columns.length), () => width / columns.length)
  );

  useEffect(() => {
    const oldWidth = columnsSizes.reduce((acc, cur) => acc + cur, 0);

    if (width === 0 || oldWidth === width) {
      return;
    }

    if (oldWidth === 0) {
      setColumnsSizes(
        Array.from(Array(columns.length), () => width / columns.length)
      );
      return;
    }

    const newColumnSizes = columnsSizes.map(
      (item) => (item / oldWidth) * width
    );

    setColumnsSizes(newColumnSizes);
  }, [width, columnsSizes, columns.length]);

  return (
    <div className={styles.explorer} ref={ref}>
      <ExplorerHeader columns={columns} sizes={columnsSizes} />
      {props.data.map((item, i) => (
        <ExplorerRow
          sizes={columnsSizes}
          key={item.name}
          data={item}
          columns={columns}
          selected={i === props.selected}
          onSelect={() => props.onSelect(i)}
          onActivate={() => props.onActivate(i)}
        />
      ))}
      {props.isNew && (
        <ExplorerEditableRow sizes={columnsSizes} columns={columns} />
      )}
    </div>
  );
};
