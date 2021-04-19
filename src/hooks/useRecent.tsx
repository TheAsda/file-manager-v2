import { warn } from 'electron-log';
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import { ContextError } from '../exceptions/hook';

type RecentStorage = string[];
const RecentContext = createContext<RecentStorage>([]);
const RecentDispatchContext = createContext<Dispatch<RecentActions>>(
  () => null
);

type RecentActions =
  | { type: 'add'; path: string }
  | { type: 'reset' }
  | { type: 'remove'; path: string };

const reducer = (
  state: RecentStorage,
  action: RecentActions
): RecentStorage => {
  switch (action.type) {
    case 'add': {
      const index = state.indexOf(action.path);
      if (index !== -1) {
        return state;
      }
      return [action.path, ...state];
    }
    case 'reset':
      return [];
    case 'remove': {
      const index = state.indexOf(action.path);
      if (index === -1) {
        warn(`Path '${action.path}' does not exist in storage`);
        return state;
      }
      state.splice(index, 1);
      return [...state];
    }
    default:
      throw new Error('Unknown commands action type');
  }
};

export const RecentProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <RecentContext.Provider value={state}>
      <RecentDispatchContext.Provider value={dispatch}>
        {children}
      </RecentDispatchContext.Provider>
    </RecentContext.Provider>
  );
};

export const useRecent = () => {
  const recent = useContext(RecentContext);

  if (recent === undefined) {
    throw new ContextError('useRecent');
  }

  return recent;
};

export const useRecentDispatch = () => {
  const dispatch = useContext(RecentDispatchContext);

  if (dispatch === undefined) {
    throw new ContextError('useRecentDispatch');
  }

  return dispatch;
};
