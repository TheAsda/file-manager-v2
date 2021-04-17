import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { ExplorerCellProps, ExplorerCell } from './explorer-cell';
import { SortDirection } from './useColumns';

export interface ExplorerHeaderCellProps extends ExplorerCellProps {
  sort?: SortDirection;
  onSort?: () => void;
}

export const ExplorerHeaderCell = ({
  sort,
  onSort,
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
    <ExplorerCell {...props} onClick={onSort}>
      {props.children}
      {icon}
    </ExplorerCell>
  );
};
