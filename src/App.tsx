import React from 'react';
import './App.global.css';
import { CommandPalette } from './components/command-palette/command-palette';
import { Panels } from './components/panels/panels';
import { CommandsProvider } from './hooks/useCommands';
import { InputModalProvider } from './hooks/useInputModal';

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
