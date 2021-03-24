import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { FocusZone } from '../types/focus-zone';

const FocusContext = createContext<FocusZone | undefined>(undefined);
const FocusActionContext = createContext<
  Dispatch<SetStateAction<FocusZone>> | undefined
>(undefined);

export const FocusProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [focus, setFocus] = useState<FocusZone>('left-panel');

  return (
    <FocusContext.Provider value={focus}>
      <FocusActionContext.Provider value={setFocus}>
        {children}
      </FocusActionContext.Provider>
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);

  if (context === undefined) {
    throw new Error('useFocus must be inside provider');
  }

  return context;
};

export const useFocusAction = () => {
  const context = useContext(FocusActionContext);

  if (context === undefined) {
    throw new Error('useFocusAction must be inside provider');
  }

  return context;
};
