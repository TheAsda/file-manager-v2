import React from 'react';
import styles from './styles.module.css';

export interface SelectPaletteItemProps {
  selected: boolean;
  value: string;
  onSelect: () => void;
}

export const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  return (
    <li
      role="menuitem"
      onKeyPress={props.onSelect}
      className={
        props.selected
          ? styles['select-palette__item']
          : styles['select-palette__item--selected']
      }
    >
      {props.value}
    </li>
  );
};
