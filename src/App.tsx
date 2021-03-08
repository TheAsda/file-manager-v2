import { log } from 'electron-log';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import './App.global.css';
import { Panels } from './components/panels/panels';
import { SelectPalette } from './components/select-palette/select-palette';
import { useKeyMap } from './hooks/useKeyMap';

export const App = () => {
  const { openCommandPalette } = useKeyMap();
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(openCommandPalette, () => setIsOpen(true));

  return (
    <>
      <Panels />
      <SelectPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={log}
        options={['New file', 'New folder', 'Enter directory']}
      />
    </>
  );
};
