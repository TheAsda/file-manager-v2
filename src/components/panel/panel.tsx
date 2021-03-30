import { createFile } from 'fs-extra';
import { error, warn } from 'electron-log';
import React, { useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { join } from 'path';
import { useRegisterCommands } from '../../hooks/useCommands';
import { useDirectory } from '../../hooks/useDirectory';
import { useKeyMap } from '../../hooks/useKeyMap';
import { usePath } from '../../hooks/usePath';
import { useSelected } from '../../hooks/useSelected';
import { Command } from '../../types/command';
import { renderLog } from '../../utils/renderLog';
import { Explorer } from '../explorer/explorer';
import { useInputModal } from '../input-modal/input-modal';
import { PathLine } from '../path-line/path-line';

export interface PanelProps {
  isFocused: boolean;
  onFocus: () => void;
}

export const Panel = ({ isFocused, onFocus }: PanelProps) => {
  renderLog('Panel');

  const initPath = useMemo(() => process.cwd(), []);
  const [path, pathDispatch] = usePath(initPath);

  const { up, down, back, activate } = useKeyMap();
  const { openInputModal } = useInputModal();
  const [data, updateDirectory] = useDirectory(path);
  const [selected, selectedDispatch] = useSelected(data.length);
  const [editable, setEditable] = useState<{
    index: number;
    isDirectory: boolean;
  } | null>(null);

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

  const commands = useMemo(() => {
    if (!isFocused) {
      return [];
    }

    return [
      {
        name: 'New file',
        handler: () => {
          openInputModal('New file', (value) => {
            createFile(join(path, value))
              .then(() => {
                return updateDirectory();
              })
              .catch(error);
          });
        },
      },
      {
        name: 'New folder',
        handler: () => {
          setEditable({
            index: selected,
            isDirectory: true,
          });
        },
      },
      {
        name: 'Rename',
        handler: () => {},
      },
    ] as Command[];
  }, [isFocused, openInputModal, path, selected, updateDirectory]);

  useRegisterCommands(isFocused ? 'panel' : null, commands);

  const onSelect = (index: number) => {
    if (!isFocused) {
      onFocus();
    }

    selectedDispatch({ type: 'select', index });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="panel-header">
        <PathLine path={path} />
      </div>
      <div className="w-full panel-content overflow-hidden bg-gray-800">
        <Explorer
          data={data}
          selected={isFocused ? selected : null}
          onSelect={onSelect}
          onActivate={(index) =>
            data[index].isDirectory &&
            pathDispatch({ type: 'enter', name: data[index].name })
          }
          editable={editable !== null ? editable.index : null}
        />
      </div>
    </div>
  );
};
