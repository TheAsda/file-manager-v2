import React from 'react';
import { ClipboardIcon } from '@radix-ui/react-icons';

export interface PathLineProps {
  path: string;
}

export const PathLine = ({ path }: PathLineProps) => {
  return (
    <div className="w-full p-1 flex justify-between bg-gray-800 text-white items-center">
      <h2>{path}</h2>
      <button type="button" className="rounded-sm hover:bg-gray-700 p-1">
        <ClipboardIcon />
      </button>
    </div>
  );
};
