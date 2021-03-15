import { join, normalize } from 'path';
import { useReducer } from 'react';

type PathStorage = string;

export type PathActions =
  | { type: 'enter'; name: string }
  | {
      type: 'exit';
    }
  | { type: 'set'; path: string };

const reducer = (state: PathStorage, action: PathActions): PathStorage => {
  switch (action.type) {
    case 'enter':
      return join(state, action.name);
    case 'exit':
      return join(state, '..');
    case 'set':
      return normalize(action.path);
    default:
      throw new Error('Unknown action type');
  }
};

export const usePath = (initialPath: string) => {
  const [path, dispatch] = useReducer(reducer, initialPath);

  return [path, dispatch] as const;
};
