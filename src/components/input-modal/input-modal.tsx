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

const InputModalContext = createContext<
  | {
      openInputModal: (handler: OnComplete) => void;
    }
  | undefined
>(undefined);

interface InputModalState {
  isOpen: boolean;
  onComplete?: null | OnComplete;
}

export type InputModalActions =
  | {
      type: 'open';
      onComplete: OnComplete;
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
      };
    case 'close':
      return {
        isOpen: false,
        onComplete: null,
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
    onComplete: null,
  });

  const closeInputModal = () => {
    if (prevRef.current !== null) {
      focusAction(prevRef.current);
      prevRef.current = null;
    }
    dispatch({ type: 'close' });
  };

  const openInputModal = (onComplete: OnComplete) => {
    focusAction((s) => {
      prevRef.current = s;
      return 'input-modal';
    });
    dispatch({
      type: 'open',
      onComplete: (value) => {
        onComplete(value);
        closeInputModal();
      },
    });
  };

  useHotkeys(
    activate,
    () => {
      const value = ref.current?.value;

      if (typeof value !== 'string' || !state.onComplete) {
        return;
      }

      state.onComplete(value);
    },
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
      >
        <input ref={ref} />
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
