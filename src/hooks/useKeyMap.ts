import { useEffect, useMemo } from 'react';
import hotkeys from 'hotkeys-js';
import { Shortcut, Shortcuts } from '../types/shortcuts';

export const useKeyMap = (): Record<Shortcut, string> => {
  const shortcuts = useMemo(
    () =>
      ({
        up: 'up',
        down: 'down',
        openCommandPalette: ['ctrl+shift+p', 'f1'],
        openGotoPalette: 'ctrl+p',
        back: 'backspace',
        activate: 'enter',
        switchPanel: 'tab',
        rename: 'f2',
        selectMultipleNext: 'shift+down',
        selectMultiplePrev: 'shift+up',
      } as Shortcuts),
    []
  );

  useEffect(() => {
    Object.values(shortcuts).forEach((shortcut) => {
      if (Array.isArray(shortcut)) {
        shortcut.forEach((item) => {
          hotkeys(item, (e) => e.preventDefault());
        });
      } else {
        hotkeys(shortcut, (e) => e.preventDefault());
      }
    });
  }, [shortcuts]);

  return Object.entries(shortcuts).reduce((acc, cur) => {
    return {
      ...acc,
      [cur[0]]: Array.isArray(cur[1]) ? cur[1].join(',') : cur[1],
    };
  }, {} as Record<Shortcut, string>);
};
