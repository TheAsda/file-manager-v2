import React from 'react';
import { ClipboardIcon, ReloadIcon } from '@radix-ui/react-icons';

export interface PathLineProps {
  path: string;
  onRefresh: () => void;
}

export const PathLine = ({ path, onRefresh }: PathLineProps) => {
  return (
    <div className="w-full p-1 flex justify-between bg-gray-800 text-white items-center">
      <h2>{path}</h2>
      <div className="flex gap-1 items-center">
        <button type="button" className="rounded-sm hover:bg-gray-700 p-1">
          <ClipboardIcon />
        </button>
        <button
          type="button"
          className="rounded-sm hover:bg-gray-700 p-1"
          onClick={onRefresh}
        >
          <ReloadIcon />
        </button>
      </div>
    </div>
  );
};
