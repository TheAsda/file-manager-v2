import { warn } from 'electron-log';
import React, { useEffect, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useSelected } from '../../hooks/useSelected';
import { renderLog } from '../../utils/renderLog';
import { Modal } from '../modal/modal';
import { SelectPaletteItem } from './select-palette-item';

export interface SelectPaletteProps {
  options: string[];
  initialSearch?: string;
  onSelect: (item: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SelectPalette = (props: SelectPaletteProps) => {
  renderLog('SelectPalette');

  const inputRef = useRef<HTMLInputElement>(null);
  const { up, down, activate } = useKeyMap();
  const [selected, dispatch] = useSelected(props.options.length);

  const keys = useMemo(() => [up, down, activate].join(','), [
    activate,
    down,
    up,
  ]);

  useHotkeys(
    keys,
    (_, handler) => {
      switch (handler.key) {
        case up:
          dispatch({ type: 'decrease' });
          break;
        case down:
          dispatch({ type: 'increase' });
          break;
        case activate:
          props.onSelect(props.options[selected]);
          break;
        default:
          warn('Unknown hotkeys key');
      }
    },
    {
      enabled: props.isOpen,
      enableOnTags: ['INPUT'],
    },
    [selected, props.options, props.onSelect, keys, dispatch]
  );

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

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current?.focus();
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="bg-gray-700 p-2 flex flex-col gap-1">
        <input
          type="text"
          ref={inputRef}
          onKeyDownCapture={(e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
            }
          }}
        />
        <ul>
          {props.options.map((opt, i) => (
            <SelectPaletteItem
              value={opt}
              selected={props.isOpen && selected === i}
              key={opt}
              onSelect={() => onSelect(i)}
            />
          ))}
        </ul>
      </div>
    </Modal>
  );
};
