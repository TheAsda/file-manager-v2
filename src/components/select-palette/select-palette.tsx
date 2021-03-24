import React, { forwardRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Modal from 'react-modal';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useSelected } from '../../hooks/useSelected';
import { SelectPaletteItem } from './select-palette-item';

export interface SelectPaletteProps {
  options: string[];
  initialSearch?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  isOpen: boolean;
  isFocused: boolean;
}

export const SelectPalette = forwardRef<HTMLUListElement, SelectPaletteProps>(
  (props, ref) => {
    const { up, down, activate } = useKeyMap();
    const [selected, dispatch] = useSelected(props.options.length);

    useHotkeys(down, () => dispatch({ type: 'increase' }), {
      enabled: props.isFocused,
    });
    useHotkeys(up, () => dispatch({ type: 'decrease' }), {
      enabled: props.isFocused,
    });
    useHotkeys(
      activate,
      () => props.onSelect(props.options[selected]),
      {
        enabled: props.isFocused,
      },
      [props.onSelect]
    );

    useEffect(() => {
      dispatch({ type: 'reset' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.options]);

    return (
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onClose}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        ariaHideApp={false}
      >
        <ul ref={ref}>
          {props.options.map((opt, i) => (
            <SelectPaletteItem
              value={opt}
              selected={props.isFocused && selected === i}
              key={opt}
              onSelect={() => props.onSelect(opt)}
            />
          ))}
        </ul>
      </Modal>
    );
  }
);

SelectPalette.displayName = 'SelectPalette';
