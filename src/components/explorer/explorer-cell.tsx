import React, { PropsWithChildren } from 'react';
import cx from 'classnames';
import styles from './styles.module.css';

export interface ExplorerCellProps extends PropsWithChildren<unknown> {
  className?: string;
}

export const ExplorerCell = ({ children, className }: ExplorerCellProps) => {
  return <div className={cx(styles.explorer__cell, className)}>{children}</div>;
};
