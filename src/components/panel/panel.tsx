import dayjs from 'dayjs';
import { log } from 'electron-log';
import React, { useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useDirectory } from '../../hooks/useDirectory';
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

  const path = useMemo(() => process.cwd(), []);

  const { up, down } = useKeyMap();
  const data = useDirectory(path);
  const [selected, dispatch] = useSelected(data.length);

  useHotkeys(down, () => isFocused && dispatch('increase'), [isFocused]);
  useHotkeys(up, () => isFocused && dispatch('decrease'), [isFocused]);

  return (
    <div>
      <Explorer data={data} selected={isFocused ? selected : null} />
    </div>
  );
};
