import React, { PropsWithChildren, HTMLAttributes } from 'react';
import cx from 'classnames';

export interface ExplorerCellProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  className?: string;
}

export const ExplorerCell = ({
  children,
  className,
  ...props
}: ExplorerCellProps) => {
  return (
    <div
      {...props}
      className={cx(
        'overflow-hidden whitespace-nowrap overflow-ellipsis flex justify-between items-center',
        className
      )}
    >
      {children}
    </div>
  );
};
