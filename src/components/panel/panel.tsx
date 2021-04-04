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
import { Explorer } from '../explorer/explorer';
import { PathLine } from '../path-line/path-line';
import { FileInfo } from '../../types/file-info';
import { useMultipleSelected } from '../../hooks/useMultipleSelected';

export interface PanelRef {
  path: string;
  currentItems: FileInfo[];
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
  const {
    up,
    down,
    back,
    activate,
    rename,
    selectMultipleNext,
    selectMultiplePrev,
  } = useKeyMap();
  const [data, updateDirectory] = useDirectory(path);
  const [editable, setEditable] = useState<number | null>(null);

  const [selected, lastSelected, selectedDispatch] = useMultipleSelected(
    data.length
  );

  const keys = useMemo(
    () =>
      [
        down,
        up,
        back,
        activate,
        rename,
        selectMultipleNext,
        selectMultiplePrev,
      ].join(','),
    [activate, back, down, rename, up, selectMultipleNext, selectMultiplePrev]
  );

  useHotkeys(
    keys,
    (_, handler) => {
      switch (handler.key) {
        case down:
          selectedDispatch({ type: 'select-next' });
          break;
        case selectMultipleNext:
          selectedDispatch({ type: 'select-next', include: true });
          break;
        case up:
          selectedDispatch({ type: 'select-prev' });
          break;
        case selectMultiplePrev:
          selectedDispatch({ type: 'select-prev', include: true });
          break;
        case back:
          pathDispatch({ type: 'exit' });
          break;
        case activate:
          if (data[lastSelected].isDirectory) {
            pathDispatch({ type: 'enter', name: data[lastSelected].name });
          }
          break;
        case rename:
          setEditable(lastSelected);
          selectedDispatch({ type: 'reset', index: lastSelected });
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
      currentItems: selected.map((i) => data[i]),
      currentElement:
        currentElementRef.current !== null
          ? currentElementRef.current
          : undefined,
      startRename: () => {
        selectedDispatch({ type: 'reset', index: lastSelected });
        setEditable(lastSelected);
      },
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
          selected={isFocused ? selected : []}
          lastSelected={lastSelected}
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
