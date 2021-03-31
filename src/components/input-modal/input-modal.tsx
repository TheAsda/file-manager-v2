import React, { useEffect, useRef } from 'react';
import { Modal } from '../modal/modal';

export interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onOk: () => void;
}

export const InputModal = (props: InputModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current?.focus();
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <div className="bg-gray-700 p-3 flex flex-col items-stretch gap-2 w-96 rounded-md">
        {props.title !== undefined && (
          <h1 className="text-white">{props.title}</h1>
        )}
        <input
          ref={inputRef}
          value={props.inputValue}
          onChange={(e) => props.onInputChange(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-600 p-1 rounded-md text-white"
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gray-600 p-1 rounded-md text-white"
            onClick={props.onOk}
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  );
};
