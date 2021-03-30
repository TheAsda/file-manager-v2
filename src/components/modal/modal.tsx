import React, { ReactNode } from 'react';
import cx from 'classnames';
import { useHotkeys } from 'react-hotkeys-hook';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCentered?: boolean;
  children: ReactNode;
}

export const Modal = (props: ModalProps) => {
  useHotkeys(
    'escape',
    () => {
      props.onClose();
    },
    { enabled: props.isOpen, enableOnTags: ['INPUT'] }
  );

  return (
    <div
      className={cx(
        'fixed top-0 left-1/2 transform -translate-x-1/2',
        props.isCentered && 'top-1/2 -translate-y-1/2'
      )}
    >
      {props.isOpen && props.children}
    </div>
  );
};
