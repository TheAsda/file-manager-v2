import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKeyMap } from '../../hooks/useKeyMap';
import { renderLog } from '../../utils/renderLog';
import { Modal } from '../modal/modal';

export type OnComplete = (value: string) => void;
export type OpenInputModal = (data: {
  title: string;
  onComplete: OnComplete;
  initialValue?: string;
  elementToFocus?: HTMLElement;
}) => void;

interface InputModalStorage {
  openInputModal: OpenInputModal;
  isOpened: boolean;
}

const InputModalContext = createContext<InputModalStorage | undefined>(
  undefined
);

interface InputModalState {
  isOpen: boolean;
  onComplete?: null | OnComplete;
  title?: string;
}

export type InputModalActions =
  | {
      type: 'open';
      onComplete: OnComplete;
      title: string;
    }
  | {
      type: 'close';
    };

const reducer = (
  _: InputModalState,
  action: InputModalActions
): InputModalState => {
  switch (action.type) {
    case 'open':
      return {
        isOpen: true,
        onComplete: action.onComplete,
        title: action.title,
      };
    case 'close':
      return {
        isOpen: false,
        onComplete: undefined,
        title: undefined,
      };
    default:
      throw new Error('Unknown action type');
  }
};

export const InputModalProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  renderLog('InputModalProvider');

  const { activate } = useKeyMap();
  const prevRef = useRef<HTMLElement | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
  });

  const closeInputModal = () => {
    if (prevRef.current !== null) {
      prevRef.current?.focus();
      prevRef.current = null;
    }
    dispatch({ type: 'close' });
  };

  const openInputModal: OpenInputModal = ({
    onComplete,
    title,
    elementToFocus,
    initialValue,
  }) => {
    if (elementToFocus !== undefined) {
      prevRef.current = elementToFocus;
    }
    if (initialValue !== undefined) {
      setInputValue(initialValue);
    } else {
      setInputValue('');
    }
    dispatch({
      type: 'open',
      title,
      onComplete,
    });
  };

  const onOk = () => {
    if (!state.onComplete) {
      return;
    }

    state.onComplete(inputValue);
    closeInputModal();
  };

  useHotkeys(
    activate,
    onOk,
    { enabled: state.isOpen, enableOnTags: ['INPUT'] },
    [state.onComplete, inputValue]
  );

  useEffect(() => {
    if (state.isOpen) {
      ref.current?.focus();
    }
  }, [state.isOpen]);

  return (
    <InputModalContext.Provider
      value={{ openInputModal, isOpened: state.isOpen }}
    >
      {children}
      <Modal isOpen={state.isOpen} onClose={closeInputModal} isCentered>
        <div className="bg-gray-700 p-3 flex flex-col items-stretch gap-2 w-96 rounded-md">
          <h1 className="text-white">{state.title}</h1>
          <input
            ref={ref}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-600 p-1 rounded-md text-white"
              onClick={closeInputModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-600 p-1 rounded-md text-white"
              onClick={onOk}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
    </InputModalContext.Provider>
  );
};

export const useInputModal = () => {
  const context = useContext(InputModalContext);

  if (context === undefined) {
    throw new Error('useInputModal must be inside provider');
  }

  return context;
};
