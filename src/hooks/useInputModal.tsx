import React, {
  PropsWithChildren,
  useRef,
  useState,
  useReducer,
  useContext,
  createContext,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKeyMap } from './useKeyMap';
import { InputModal } from '../components/input-modal/input-modal';

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
  const { activate } = useKeyMap();
  const prevRef = useRef<HTMLElement | null>(null);
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

  return (
    <InputModalContext.Provider
      value={{ openInputModal, isOpened: state.isOpen }}
    >
      {children}
      <InputModal
        isOpen={state.isOpen}
        inputValue={inputValue}
        onInputChange={setInputValue}
        title={state.title}
        onClose={closeInputModal}
        onOk={onOk}
      />
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
