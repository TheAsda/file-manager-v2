import React, { useEffect, useRef } from 'react';

export interface SelectPaletteItemProps {
  selected: boolean;
  value: string;
  onSelect: () => void;
}

export const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (props.selected) {
      ref.current?.focus();
    }
  }, [props.selected]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      ref={ref}
      role="option"
      aria-selected={props.selected}
      tabIndex={0}
      className="cursor-pointer bg-gray-400 hover:bg-gray-300"
      onClick={props.onSelect}
    >
      {props.value}
    </li>
  );
};
