import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCommands } from '../../hooks/useCommands';
import { useKeyMap } from '../../hooks/useKeyMap';
import { SelectPalette } from '../select-palette/select-palette';

export const CommandPalette = () => {
  const { openCommandPalette } = useKeyMap();
  const commands = useCommands();
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(openCommandPalette, () => {
    setIsOpen(true);
  });

  const closePalette = () => {
    setIsOpen(false);
  };

  return (
    <SelectPalette
      isOpen={isOpen}
      onClose={closePalette}
      onSelect={(opt) => {
        closePalette();
        commands.find((item) => item.name === opt)?.handler();
      }}
      options={commands.map((item) => item.name)}
    />
  );
};
