import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  useRef,
} from 'react';
import { ConfirmModal } from '../components/confirm-modal/confirm-modal';
import { UnknownActionTypeError } from '../exceptions/reducer';

export type OpenConfirmDialog = (data: {
  title: string;
  onOk: () => void;
  onCancel?: () => void;
  elementToFocus?: HTMLElement;
}) => void;

interface ConfirmDialogStorage {
  openConfirmDialog: OpenConfirmDialog;
  isOpen: boolean;
}

const ConfirmDialogContext = createContext<ConfirmDialogStorage | undefined>(
  undefined
);

interface ConfirmDialogState {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  title: string;
}

export type ConfirmDialogActions =
  | {
      type: 'open';
      onOk: () => void;
      onCancel?: () => void;
      title: string;
    }
  | {
      type: 'close';
    };

const reducer = (
  _: ConfirmDialogState,
  action: ConfirmDialogActions
): ConfirmDialogState => {
  switch (action.type) {
    case 'open':
      return {
        isOpen: true,
        title: action.title,
        onOk: action.onOk,
        onCancel: action.onCancel,
      };
    case 'close':
      return {
        isOpen: false,
        title: '',
        onOk: undefined,
        onCancel: undefined,
      };
    default:
      throw new UnknownActionTypeError();
  }
};

export const ConfirmModalProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const prevRef = useRef<HTMLElement | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    title: '',
  });

  const closeConfirmModal = () => {
    if (prevRef.current !== undefined) {
      prevRef.current?.focus();
      prevRef.current = null;
    }
    dispatch({
      type: 'close',
    });
  };

  const openConfirmDialog: OpenConfirmDialog = ({
    onOk,
    title,
    elementToFocus,
    onCancel,
  }) => {
    if (elementToFocus !== undefined) {
      prevRef.current = elementToFocus;
    }
    dispatch({
      type: 'open',
      onOk,
      title,
      onCancel,
    });
  };

  const onOk = () => {
    state.onOk?.();
    closeConfirmModal();
  };

  const onCancel = () => {
    state.onCancel?.();
    closeConfirmModal();
  };

  <ConfirmDialogContext.Provider
    value={{ isOpen: state.isOpen, openConfirmDialog }}
  >
    {children}
    <ConfirmModal
      isOpen={state.isOpen}
      onOk={onOk}
      onClose={onCancel}
      title={state.title}
    />
  </ConfirmDialogContext.Provider>;
};
