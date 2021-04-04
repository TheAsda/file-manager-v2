import React from 'react';
import './App.global.css';
import { CommandPalette } from './components/command-palette/command-palette';
import { CommandsProvider } from './hooks/useCommands';
import { InputModalProvider } from './hooks/useInputModal';
import { Window } from './components/window/window';

export const App = () => {
  return (
    <CommandsProvider>
      <InputModalProvider>
        <Window />
        <CommandPalette />
      </InputModalProvider>
    </CommandsProvider>
  );
};
