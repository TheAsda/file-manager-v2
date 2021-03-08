import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Modal } from 'react-responsive-modal';
import { useKeyMap } from '../../hooks/useKeyMap';
import { SelectPaletteItem } from './select-palette-item';

export interface SelectPaletteProps {
  options: string[];
  initialSearch?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SelectPalette = (props: SelectPaletteProps) => {
  const { up, down } = useKeyMap();
  const [selected, setSelected] = useState(0);

  useHotkeys(down, () => setSelected((s) => s + 1));
  useHotkeys(up, () => setSelected((s) => s - 1));

  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      showCloseIcon={false}
      closeOnOverlayClick
      center
    >
      <ul>
        {props.options.map((opt, i) => (
          <SelectPaletteItem
            value={opt}
            selected={selected === i}
            key={opt}
            onSelect={() => null}
          />
        ))}
      </ul>
    </Modal>
  );
};
