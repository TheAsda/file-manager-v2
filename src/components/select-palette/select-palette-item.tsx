import React, { useRef } from 'react';
import cx from 'classnames';

export interface SelectPaletteItemProps {
  selected: boolean;
  value: string;
  onSelect: () => void;
}

export const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  const ref = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={props.selected}
      className={cx(
        'cursor-pointer bg-gray-400 hover:bg-gray-300',
        props.selected && 'bg-gray-500'
      )}
      onClick={props.onSelect}
    >
      {props.value}
    </li>
  );
};
