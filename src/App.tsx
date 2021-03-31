import React from 'react';
import './App.global.css';
import { CommandPalette } from './components/command-palette/command-palette';
import { InputModalProvider } from './components/input-modal/input-modal';
import { Panels } from './components/panels/panels';
import { CommandsProvider } from './hooks/useCommands';

export const App = () => {
  return (
    <CommandsProvider>
      <InputModalProvider>
        <Panels />
        <CommandPalette />
      </InputModalProvider>
    </CommandsProvider>
  );
};
