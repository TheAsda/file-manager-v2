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
    <li
      ref={ref}
      role="menuitem"
      tabIndex={0}
      onKeyPress={props.onSelect}
      className="cursor-pointer bg-gray-400 hover:bg-gray-300"
      onClick={props.onSelect}
    >
      {props.value}
    </li>
  );
};
