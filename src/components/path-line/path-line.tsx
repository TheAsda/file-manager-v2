import React from 'react';

export interface PathLineProps {
  path: string;
}

export const PathLine = ({ path }: PathLineProps) => {
  return <div className="w-full">{path}</div>;
};
