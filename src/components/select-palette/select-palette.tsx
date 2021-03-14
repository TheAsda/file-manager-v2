import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Modal } from 'react-responsive-modal';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useSelected } from '../../hooks/useSelected';
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
  const [selected, dispatch] = useSelected(props.options.length);

  useHotkeys(down, () => dispatch({ type: 'increase' }));
  useHotkeys(up, () => dispatch({ type: 'decrease' }));

  useEffect(() => {
    dispatch({ type: 'reset' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.options]);

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
