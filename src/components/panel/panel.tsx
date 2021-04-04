import { warn } from 'electron-log';
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { join } from 'path';
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
  startRename: () => void;
}

export interface PanelProps {
  isFocused: boolean;
  onFocus: () => void;
  panelRef?: MutableRefObject<PanelRef | undefined>;
  onRename: (newName: string, oldName: string, path: string) => void;
}

export const Panel = ({
  isFocused,
  onFocus,
  panelRef,
  onRename,
}: PanelProps) => {
  const initPath = useMemo(() => join(process.cwd(), 'tmp'), []);
  const [path, pathDispatch] = usePath(initPath);

  const currentElementRef = useRef<HTMLDivElement>(null);
  const { up, down, back, activate, rename } = useKeyMap();
  const [data, updateDirectory] = useDirectory(path);
  const [editable, setEditable] = useState<number | null>(null);

  const [selected, selectedDispatch] = useSelected(data.length);

  const keys = useMemo(() => [down, up, back, activate, rename].join(','), [
    activate,
    back,
    down,
    rename,
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
          if (data[selected].isDirectory) {
            pathDispatch({ type: 'enter', name: data[selected].name });
          }
          break;
        case rename:
          setEditable(selected);
          break;
        default:
          warn('Unknown hotkeys key');
      }
    },
    { enabled: isFocused },
    [down, up, back, activate, data, selected, rename]
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
      updateDirectory,
      currentItem: data[selected],
      currentElement:
        currentElementRef.current !== null
          ? currentElementRef.current
          : undefined,
      startRename: () => setEditable(selected),
    };
  }

  useEffect(() => {
    if (isFocused) {
      currentElementRef.current?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selected, isFocused]);

  return (
    <div className="h-full w-full overflow-hidden panel">
      <PathLine path={path} onRefresh={updateDirectory} />
      <div className="w-full overflow-hidden bg-gray-800">
        <Explorer
          data={data}
          selected={isFocused ? selected : null}
          onSelect={onSelect}
          onActivate={(index) =>
            data[index].isDirectory &&
            pathDispatch({ type: 'enter', name: data[index].name })
          }
          editable={editable}
          currentElementRef={currentElementRef}
          onEditCancel={() => setEditable(null)}
          onEditComplete={(value) => {
            if (editable === null) {
              return;
            }
            onRename(value, data[editable].name, data[editable].path);
            setEditable(null);
          }}
        />
      </div>
    </div>
  );
};
