import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

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
      className={styles['select-palette__item']}
      onClick={props.onSelect}
    >
      {props.value}
    </li>
  );
};
