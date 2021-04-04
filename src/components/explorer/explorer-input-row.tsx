import React, { forwardRef, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';
import { ExplorerRowProps } from './explorer-row';
import { ExplorerCell } from './explorer-cell';

export interface ExplorerInputProps extends ExplorerRowProps {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
}

export const ExplorerInputRow = forwardRef<HTMLDivElement, ExplorerInputProps>(
  (props, ref) => {
    if (props.sizes.length !== props.columns.length) {
      throw new Error('Sizes count are not equal to columns count');
    }
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    useHotkeys('escape', props.onCancel, { enableOnTags: ['INPUT'] }, [
      props.onCancel,
    ]);

    return (
      <div
        ref={ref}
        className={cx(
          'grid hover:bg-gray-500 w-full',
          props.selected && 'bg-gray-600'
        )}
        style={{
          gridTemplateColumns: props.sizes.map((item) => `${item}px`).join(' '),
        }}
        role="option"
        aria-selected={props.selected}
      >
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="bg-transparent"
          onBlur={props.onCancel}
          ref={inputRef}
        />
        {props.columns
          .filter((item) => item.accessor !== 'name')
          .map((col) => (
            <ExplorerCell key={col.header}>
              {typeof col.accessor === 'string'
                ? props.data[col.accessor]
                : col.accessor(props.data)}
            </ExplorerCell>
          ))}
      </div>
    );
  }
);
