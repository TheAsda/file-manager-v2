import { useEffect, useMemo } from 'react';
import hotkeys from 'hotkeys-js';

export const useKeyMap = () => {
  const data = useMemo(
    () => ({
      up: 'up',
      down: 'down',
      openCommandPalette: 'ctrl+shift+p',
      back: 'backspace',
      activate: 'enter',
      switchPanel: 'tab',
    }),
    []
  );

  useEffect(() => {
    Object.values(data).forEach((key) => {
      hotkeys(key, (e) => e.preventDefault());
    });
  }, [data]);

  return data;
};
