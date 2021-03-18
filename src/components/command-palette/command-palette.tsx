import { log } from 'electron-log';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isDev } from '../../config';
import { useCommands } from '../../hooks/useCommands';
import { useFocus, useFocusAction } from '../../hooks/useFocus';
import { useKeyMap } from '../../hooks/useKeyMap';
import { FocusZone } from '../../types/focus-zone';
import { SelectPalette } from '../select-palette/select-palette';

export const CommandPalette = () => {
  if (isDev) {
    log('CommandPalette render');
  }

  const { openCommandPalette } = useKeyMap();
  const commands = useCommands();
  const [isOpen, setIsOpen] = useState(false);
  const focus = useFocus();
  const ref = useRef<HTMLUListElement>(null);
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

  useEffect(() => {
    if (focus === 'command-palette') {
      ref.current?.focus();
    }
  }, [focus]);

  return (
    <SelectPalette
      isOpen={isOpen}
      onClose={closePalette}
      onSelect={log}
      options={commands.map((item) => item.name)}
      ref={ref}
    />
  );
};
