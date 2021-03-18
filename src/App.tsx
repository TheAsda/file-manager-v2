import React from 'react';
import './App.global.css';
import { CommandPalette } from './components/command-palette/command-palette';
import { Panels } from './components/panels/panels';
import { CommandsProvider } from './hooks/useCommands';
import { FocusProvider } from './hooks/useFocus';

export const App = () => {
  return (
    <FocusProvider>
      <CommandsProvider>
        <Panels />
        <CommandPalette />
      </CommandsProvider>
    </FocusProvider>
  );
};
