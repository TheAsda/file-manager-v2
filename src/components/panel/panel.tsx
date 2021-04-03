import { warn } from 'electron-log';
import React, { MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDirectory } from '../../hooks/useDirectory';
import { useKeyMap } from '../../hooks/useKeyMap';
import { usePath } from '../../hooks/usePath';
import { useSelected } from '../../hooks/useSelected';
import { Explorer } from '../explorer/explorer';
import { PathLine } from '../path-line/path-line';
import { FileInfo } from '../../types/file-info';

export interface PanelRef {
  path: string;
  currentItem: FileInfo;
  currentElement?: HTMLElement;
  updateDirectory: () => void;
}

export interface PanelProps {
  isFocused: boolean;
  onFocus: () => void;
  panelRef?: MutableRefObject<PanelRef | undefined>;
}

export const Panel = ({ isFocused, onFocus, panelRef }: PanelProps) => {
  const initPath = useMemo(() => process.cwd(), []);
  const [path, pathDispatch] = usePath(initPath);

  const currentElementRef = useRef<HTMLDivElement>(null);
  const { up, down, back, activate } = useKeyMap();
  const [data] = useDirectory(path);

  const [selected, selectedDispatch] = useSelected(data.length);

  const keys = useMemo(() => [down, up, back, activate].join(','), [
    activate,
    back,
    down,
    up,
  ]);

  useHotkeys(
    keys,
    (_, handler) => {
      switch (handler.key) {
        case down:
          selectedDispatch({ type: 'increase' });
          break;
        case up:
          selectedDispatch({ type: 'decrease' });
          break;
        case back:
          pathDispatch({ type: 'exit' });
          break;
        case activate:
          pathDispatch({ type: 'enter', name: data[selected].name });
          break;
        default:
          warn('Unknown hotkeys key');
      }
    },
    { enabled: isFocused },
    [down, up, back, activate, data, selected]
  );

  const onSelect = (index: number) => {
    if (!isFocused) {
      onFocus();
    }

    selectedDispatch({ type: 'select', index });
  };

  if (panelRef !== undefined) {
    panelRef.current = {
      path,
      updateDirectory: () => {},
      currentItem: data[selected],
      currentElement:
        currentElementRef.current !== null
          ? currentElementRef.current
          : undefined,
    };
  }

  useEffect(() => {
    currentElementRef.current?.scrollIntoView({
      block: 'nearest',
    });
  }, [selected]);

  return (
    <div className="h-full w-full overflow-hidden panel">
      <PathLine path={path} />
      <div className="w-full overflow-hidden bg-gray-800">
        <Explorer
          data={data}
          selected={isFocused ? selected : null}
          onSelect={onSelect}
          onActivate={(index) =>
            data[index].isDirectory &&
            pathDispatch({ type: 'enter', name: data[index].name })
          }
          editable={null}
          currentElementRef={currentElementRef}
        />
      </div>
    </div>
  );
};
