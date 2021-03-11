import { log } from 'electron-log';
import { useCallback, useEffect, useReducer } from 'react';

export type ActionType = 'increase' | 'decrease' | 'reset';

interface State {
  max: number;
  selected: number;
}

const reducer = (state: State, type: ActionType | { max: number }): State => {
  switch (type) {
    case 'increase':
      if (state.selected < state.max - 1) {
        return {
          max: state.max,
          selected: state.selected + 1,
        };
      }
      return state;
    case 'decrease':
      if (state.selected > 0) {
        return {
          max: state.max,
          selected: state.selected - 1,
        };
      }
      return state;
    case 'reset':
      return {
        max: state.max,
        selected: 0,
      };
    default:
      if (typeof type.max !== 'number') {
        throw new Error('Unknown type');
      }
      return {
        selected: 0,
        max: type.max,
      };
  }
};

export const useSelected = (max: number) => {
  const [state, dispatch] = useReducer(reducer, {
    max,
    selected: 0,
  });

  useEffect(() => {
    if (max !== state.max) {
      dispatch({ max });
    }
  }, [max, state.max]);

  return [state.selected, dispatch as (type: ActionType) => void] as const;
};
