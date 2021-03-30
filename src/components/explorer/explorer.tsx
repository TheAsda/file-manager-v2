import React, { useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { useColumns } from './useColumns';
import { FileInfo } from '../../types/file-info';
import { ExplorerRow } from './explorer-row';
import { ExplorerHeader } from './explorer-header';
import { renderLog } from '../../utils/renderLog';

export interface ExplorerProps {
  data: FileInfo[];
  selected: number | null;
  onSelect: (index: number) => void;
  onActivate: (index: number) => void;
  editable: number | null;
}

export const Explorer = (props: ExplorerProps) => {
  renderLog('Explorer');

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
    <div
      className="flex flex-col flex-grow h-full bg-gray-900 text-white m-1"
      ref={ref}
    >
      <ExplorerHeader columns={columns} sizes={columnsSizes} />
      <div className="flex-grow bg-gray-900 explorer-content overflow-x-overlay">
        <div className="w-full">
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
        </div>
      </div>
    </div>
  );
};
