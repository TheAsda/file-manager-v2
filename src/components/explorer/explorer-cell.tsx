import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

export interface ExplorerCellProps extends PropsWithChildren<unknown> {
  className?: string;
}

export const ExplorerCell = ({ children, className }: ExplorerCellProps) => {
  return (
    <div
      className={cx(
        'overflow-hidden whitespace-nowrap overflow-ellipsis',
        className
      )}
    >
      {children}
    </div>
  );
};
