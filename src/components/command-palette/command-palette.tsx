import React, { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCommands } from '../../hooks/useCommands';
import { useFocus, useFocusAction } from '../../hooks/useFocus';
import { useKeyMap } from '../../hooks/useKeyMap';
import { FocusZone } from '../../types/focus-zone';
import { renderLog } from '../../utils/renderLog';
import { SelectPalette } from '../select-palette/select-palette';

export const CommandPalette = () => {
  renderLog('CommandPalette');

  const { openCommandPalette } = useKeyMap();
  const commands = useCommands();
  const [isOpen, setIsOpen] = useState(false);
  const focus = useFocus();
  const focusAction = useFocusAction();
  const prevRef = useRef<FocusZone | null>(null);

  useHotkeys(openCommandPalette, () => {
    focusAction((s) => {
      prevRef.current = s;
      return 'command-palette';
    });
    setIsOpen(true);
  });

  const closePalette = () => {
    if (prevRef.current !== null) {
      focusAction(prevRef.current);
      prevRef.current = null;
    }
    setIsOpen(false);
  };

  return (
    <SelectPalette
      isOpen={isOpen && focus === 'command-palette'}
      onClose={closePalette}
      onSelect={(opt) => {
        commands.find((item) => item.name === opt)?.handler();
      }}
      options={commands.map((item) => item.name)}
    />
  );
};
