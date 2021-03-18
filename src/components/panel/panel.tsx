import { log, warn } from 'electron-log';
import hotkeys from 'hotkeys-js';
import React, { useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useCommands, useRegisterCommands } from '../../hooks/useCommands';
import { useDirectory } from '../../hooks/useDirectory';
import { useKeyMap } from '../../hooks/useKeyMap';
import { usePath } from '../../hooks/usePath';
import { useSelected } from '../../hooks/useSelected';
import { Command } from '../../types/command';
import { Explorer } from '../explorer/explorer';

export interface PanelProps {
  isFocused: boolean;
}

export const Panel = ({ isFocused }: PanelProps) => {
  if (isDev) {
    log(`Panel rendered`);
  }

  const [path, pathDispatch] = usePath(process.cwd());

  const { up, down, back, activate } = useKeyMap();
  const data = useDirectory(path);
  const [selected, selectedDispatch] = useSelected(data.length);
  const [editable, setEditable] = useState<{
    index: number;
    isDirectory: boolean;
  } | null>(null);
  const [isNew, setIsNew] = useState(false);

  const keys = [down, up, back, activate].join(',');

  useHotkeys<HTMLDivElement>(
    keys,
    (e, handler) => {
      switch (handler.key) {
        case down:
          if (isFocused) {
            selectedDispatch({ type: 'increase' });
          }
          break;
        case up:
          if (isFocused) {
            selectedDispatch({ type: 'decrease' });
          }
          break;
        case back:
          if (isFocused) {
            pathDispatch({ type: 'exit' });
          }
          break;
        case activate:
          if (isFocused) {
            pathDispatch({ type: 'enter', name: data[selected].name });
          }
          break;
        default:
          warn('Unknown hotkeys key');
      }
    },
    [down, up, back, activate, isFocused, data, selected]
  );

  const commands = useMemo(() => {
    if (!isFocused) {
      return [];
    }

    return [
      {
        name: 'New file',
        handler: () => {
          setEditable({
            index: selected,
            isDirectory: false,
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
        handler: () => {
          setIsNew(true);
        },
      },
    ] as Command[];
  }, [isFocused, selected]);

  useRegisterCommands(isFocused ? 'panel' : null, commands);

  return (
    <div>
      <Explorer
        data={data}
        selected={isFocused ? selected : null}
        onSelect={(index) => selectedDispatch({ type: 'select', index })}
        onActivate={(index) =>
          data[index].isDirectory &&
          pathDispatch({ type: 'enter', name: data[index].name })
        }
        editable={editable !== null ? editable.index : null}
        isNew={isNew}
      />
    </div>
  );
};
