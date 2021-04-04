import React, { MutableRefObject, useEffect, useState } from 'react';
import { useMeasure } from 'react-use';
import { useHotkeys } from 'react-hotkeys-hook';
import { useColumns } from './useColumns';
import { FileInfo } from '../../types/file-info';
import { ExplorerRow } from './explorer-row';
import { ExplorerHeader } from './explorer-header';
import { ExplorerInput } from './explorer-input';

export interface ExplorerProps {
  data: FileInfo[];
  selected: number | null;
  onSelect: (index: number) => void;
  onActivate: (index: number) => void;
  editable: number | null;
  onEditCancel: () => void;
  onEditComplete: (value: string) => void;
  currentElementRef?: MutableRefObject<HTMLDivElement | null>;
}

export const Explorer = (props: ExplorerProps) => {
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

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (props.editable !== null) {
      setInputValue(props.data[props.editable].name);
    }
  }, [props.data, props.editable]);

  useHotkeys(
    'enter',
    () => props.onEditComplete(inputValue),
    {
      enabled: props.editable !== null,
      enableOnTags: ['INPUT'],
    },
    [props.onEditComplete, inputValue]
  );

  return (
    <div
      className="flex flex-col flex-grow h-full bg-gray-900 text-white p-1"
      ref={ref}
    >
      <ExplorerHeader columns={columns} sizes={columnsSizes} />
      <div className="flex-grow bg-gray-900 explorer-content overflow-y-overlay">
        <div className="w-full">
          {props.data.map((item, i) => {
            if (i === props.editable) {
              return (
                <ExplorerInput
                  sizes={columnsSizes}
                  key={item.name}
                  data={item}
                  columns={columns}
                  selected={i === props.selected}
                  onSelect={() => props.onSelect(i)}
                  onActivate={() => props.onActivate(i)}
                  ref={
                    i === props.selected ? props.currentElementRef : undefined
                  }
                  onChange={setInputValue}
                  value={inputValue}
                  onCancel={props.onEditCancel}
                />
              );
            }

            return (
              <ExplorerRow
                sizes={columnsSizes}
                key={item.name}
                data={item}
                columns={columns}
                selected={i === props.selected}
                onSelect={() => props.onSelect(i)}
                onActivate={() => props.onActivate(i)}
                ref={i === props.selected ? props.currentElementRef : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
