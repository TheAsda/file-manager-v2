import React, { useEffect, useRef } from 'react';
import { Modal } from '../modal/modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onOk: () => void;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (props.isOpen) {
      okRef.current?.focus();
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <div
        data-testid="confirm-modal"
        className="bg-gray-700 p-3 flex flex-col items-stretch gap-2 rounded-md"
      >
        <h1 className="text-white">{props.title}</h1>
        <div className="flex gap-2 items-center justify-end">
          <button
            type="button"
            onClick={props.onClose}
            className="bg-gray-600 p-1 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            ref={okRef}
            type="submit"
            onClick={props.onOk}
            className="bg-gray-600 p-1 rounded-md text-white"
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  );
};
