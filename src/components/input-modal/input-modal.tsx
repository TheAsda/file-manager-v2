import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useRef,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Modal from 'react-modal';
import { useFocus, useFocusAction } from '../../hooks/useFocus';
import { useKeyMap } from '../../hooks/useKeyMap';
import { FocusZone } from '../../types/focus-zone';
import { renderLog } from '../../utils/renderLog';

export type OnComplete = (value: string) => void;
export type OpenInputModal = (title: string, onComplete: OnComplete) => void;

const InputModalContext = createContext<
  | {
      openInputModal: OpenInputModal;
    }
  | undefined
>(undefined);

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
  const focus = useFocus();
  const focusAction = useFocusAction();
  const prevRef = useRef<FocusZone | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
  });

  const closeInputModal = () => {
    if (prevRef.current !== null) {
      focusAction(prevRef.current);
      prevRef.current = null;
    }
    dispatch({ type: 'close' });
  };

  const openInputModal: OpenInputModal = (title, onComplete) => {
    focusAction((s) => {
      prevRef.current = s;
      return 'input-modal';
    });
    dispatch({
      type: 'open',
      title,
      onComplete: (value) => {
        onComplete(value);
        closeInputModal();
      },
    });
  };

  const onOk = () => {
    const value = ref.current?.value;

    if (typeof value !== 'string' || !state.onComplete) {
      return;
    }

    state.onComplete(value);
  };

  useHotkeys(
    activate,
    onOk,
    { enabled: focus === 'input-modal', enableOnTags: ['INPUT'] },
    [state.onComplete]
  );

  return (
    <InputModalContext.Provider value={{ openInputModal }}>
      {children}
      <Modal
        isOpen={state.isOpen}
        onRequestClose={closeInputModal}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        onAfterOpen={() => {
          ref.current?.focus();
        }}
        ariaHideApp={false}
        className="grid place-items-center w-full h-full"
      >
        <div className="bg-gray-700 p-3 flex flex-col items-stretch gap-2 w-96 rounded-md">
          <h1 className="text-white">{state.title}</h1>
          <input ref={ref} />
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
