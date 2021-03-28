import React, { forwardRef, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Modal from 'react-modal';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useSelected } from '../../hooks/useSelected';
import { renderLog } from '../../utils/renderLog';
import { SelectPaletteItem } from './select-palette-item';

export interface SelectPaletteProps {
  options: string[];
  initialSearch?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SelectPalette = forwardRef<HTMLUListElement, SelectPaletteProps>(
  (props, ref) => {
    renderLog('SelectPalette');

    const { up, down, activate, escape } = useKeyMap();
    const [selected, dispatch] = useSelected(props.options.length);

    useHotkeys(down, () => dispatch({ type: 'increase' }), {
      enabled: props.isOpen,
    });
    useHotkeys(up, () => dispatch({ type: 'decrease' }), {
      enabled: props.isOpen,
    });
    useHotkeys(
      activate,
      () => props.onSelect(props.options[selected]),
      {
        enabled: props.isOpen,
      },
      [props.onSelect, selected]
    );
    useHotkeys(escape, () => props.onClose(), { enabled: props.isOpen }, [
      props.onClose,
    ]);

    useEffect(() => {
      dispatch({ type: 'reset' });
    }, [dispatch, props.options]);

    const onSelect = (index: number) => {
      dispatch({
        type: 'select',
        index,
      });

      props.onSelect(props.options[index]);
    };

    return (
      <Modal
        isOpen={props.isOpen}
        onRequestClose={props.onClose}
        shouldCloseOnOverlayClick
        ariaHideApp={false}
      >
        <ul ref={ref}>
          {props.options.map((opt, i) => (
            <SelectPaletteItem
              value={opt}
              selected={props.isOpen && selected === i}
              key={opt}
              onSelect={() => onSelect(i)}
            />
          ))}
        </ul>
      </Modal>
    );
  }
);

SelectPalette.displayName = 'SelectPalette';
