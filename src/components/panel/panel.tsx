import dayjs from 'dayjs';
import { log } from 'electron-log';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useSelected } from '../../hooks/useSelected';
import { Explorer } from '../explorer/explorer';

export interface PanelProps {
  isFocused: boolean;
}

export const Panel = ({ isFocused }: PanelProps) => {
  if (isDev) {
    log(`Panel rendered`);
  }

  const { up, down } = useKeyMap();
  const [selected, dispatch] = useSelected(2);

  useHotkeys(down, () => isFocused && dispatch('increase'), [isFocused]);
  useHotkeys(up, () => isFocused && dispatch('decrease'), [isFocused]);

  return (
    <div>
      <Explorer
        data={[
          {
            name: 'file.txt',
            path: 'C:\\file.txt',
            created: dayjs(),
            lastModified: dayjs(),
            isDirectory: false,
            size: 123,
          },
          {
            name: 'folder',
            path: 'C:\\folder',
            created: dayjs(),
            lastModified: dayjs(),
            isDirectory: true,
            size: 0,
          },
        ]}
        selected={isFocused ? selected : null}
      />
    </div>
  );
};
