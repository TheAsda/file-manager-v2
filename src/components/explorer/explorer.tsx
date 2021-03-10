import { log } from 'electron-log';
import React, { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { isDev } from '../../config';
import { useColumns } from './useColumns';
import { FileInfo } from '../../types/file-info';
import styles from './styles.module.css';
import { ExplorerRow } from './explorer-row';
import { ExplorerHeader } from './explorer-header';

export interface ExplorerProps {
  data: FileInfo[];
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

  log(columnsSizes);

  return (
    <div className={styles.explorer} ref={ref}>
      <ExplorerHeader columns={columns} sizes={columnsSizes} />
      {props.data.map((item) => (
        <ExplorerRow
          sizes={columnsSizes}
          key={item.name}
          data={item}
          columns={columns}
        />
      ))}
    </div>
  );
};
