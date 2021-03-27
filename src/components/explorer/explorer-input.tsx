import React from 'react';

export interface ExplorerInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExplorerInput = ({ value, onChange }: ExplorerInputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
};
