import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKeyMap } from '../../hooks/useKeyMap';
import { useRecent, useRecentDispatch } from '../../hooks/useRecent';
import { exists } from '../../utils/fsActions';
import { SelectPalette } from '../select-palette/select-palette';

export interface GotoPaletteProps {
  openDirectory: (path: string) => void;
}

export const GotoPalette = ({ openDirectory }: GotoPaletteProps) => {
  const { openGotoPalette } = useKeyMap();
  const recent = useRecent();
  const dispatch = useRecentDispatch();
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(openGotoPalette, () => {
    setIsOpen(true);
  });

  const closePalette = () => {
    setIsOpen(false);
  };

  const onSelect = async (option: string) => {
    if (!(await exists(option))) {
      dispatch({ type: 'remove', path: option });
      return;
    }
    openDirectory(option);
    closePalette();
  };

  return (
    <SelectPalette
      isOpen={isOpen}
      onClose={closePalette}
      onSelect={onSelect}
      options={recent}
    />
  );
};
