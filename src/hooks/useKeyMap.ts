import { useMemo } from 'react';

export const useKeyMap = () => {
  const data = useMemo(
    () => ({
      up: 'up',
      down: 'down',
      openCommandPalette: 'ctrl+shift+p',
    }),
    []
  );

  return data;
};
