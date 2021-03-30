import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { ExplorerCellProps, ExplorerCell } from './explorer-cell';

export type SortType = 'asc' | 'desc';

export interface ExplorerHeaderCellProps extends ExplorerCellProps {
  sort?: SortType;
}

export const ExplorerHeaderCell = ({
  sort,
  ...props
}: ExplorerHeaderCellProps) => {
  let icon = null;

  switch (sort) {
    case 'asc':
      icon = <ArrowUpIcon />;
      break;
    case 'desc':
      icon = <ArrowDownIcon />;
      break;
    default:
      icon = null;
  }

  return (
    <ExplorerCell {...props}>
      {props.children}
      {icon}
    </ExplorerCell>
  );
};
