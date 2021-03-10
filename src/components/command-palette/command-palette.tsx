import { log } from 'electron-log';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useCommands } from '../../hooks/useCommands';
import { useKeyMap } from '../../hooks/useKeyMap';
import { SelectPalette } from '../select-palette/select-palette';

export const CommandPalette = () => {
  if (isDev) {
    log('CommandPalette render');
  }

  const { openCommandPalette } = useKeyMap();
  const commands = useCommands();
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(openCommandPalette, () => setIsOpen(true));

  return (
    <SelectPalette
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSelect={log}
      options={commands.map((item) => item.name)}
    />
  );
};
