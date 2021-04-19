import { warn } from 'electron-log';
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Command } from '../types/command';

type CommandsStorage = Record<string, Command[]>;
const CommandsContext = createContext<CommandsStorage | undefined>(undefined);
const CommandsDispatchContext = createContext<
  Dispatch<CommandsActions> | undefined
>(undefined);

type CommandsActions =
  | {
      type: 'register';
      key: string;
      commands: Command[];
    }
  | {
      type: 'unregister';
      key: string;
    };

const reducer = (
  state: CommandsStorage,
  action: CommandsActions
): CommandsStorage => {
  switch (action.type) {
    case 'register':
      return {
        ...state,
        [action.key]: action.commands,
      };
    case 'unregister':
      if (Object.keys(state).includes(action.key)) {
        warn(`Key "${action.key}" does not exist in commands state`);
        return state;
      }
      delete state[action.key];

      return { ...state };
    default:
      throw new Error('Unknown commands action type');
  }
};

export const CommandsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <CommandsContext.Provider value={state}>
      <CommandsDispatchContext.Provider value={dispatch}>
        {children}
      </CommandsDispatchContext.Provider>
    </CommandsContext.Provider>
  );
};

export const useRegisterCommands = (
  key: string | null,
  commands: Command[]
) => {
  const dispatch = useContext(CommandsDispatchContext);

  if (dispatch === undefined) {
    throw new Error('useRegisterCommands must be inside provider');
  }

  useEffect(() => {
    if (key === null) {
      return;
    }
    dispatch({ type: 'register', key, commands });

    // eslint-disable-next-line consistent-return
    // return () => {
    //   dispatch({ type: 'unregister', key });
    // };
  }, [commands, dispatch, key]);
};

export const useCommands = () => {
  const commands = useContext(CommandsContext);

  if (commands === undefined) {
    throw new Error('useCommands must be inside provider');
  }

  return Object.values(commands).reduce(
    (acc, cur) => [...acc, ...cur],
    [] as Command[]
  );
};
