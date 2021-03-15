import { log } from 'electron-log';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useDirectory } from '../../hooks/useDirectory';
import { useKeyMap } from '../../hooks/useKeyMap';
import { usePath } from '../../hooks/usePath';
import { useSelected } from '../../hooks/useSelected';
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

  useHotkeys(down, () => isFocused && selectedDispatch({ type: 'increase' }), [
    isFocused,
  ]);
  useHotkeys(up, () => isFocused && selectedDispatch({ type: 'decrease' }), [
    isFocused,
  ]);
  useHotkeys(back, () => isFocused && pathDispatch({ type: 'exit' }), [
    isFocused,
  ]);
  useHotkeys(
    activate,
    () =>
      isFocused && pathDispatch({ type: 'enter', name: data[selected].name }),
    [isFocused, data, selected]
  );

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
      />
    </div>
  );
};
