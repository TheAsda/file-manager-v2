import { error } from 'electron-log';
import { useEffect, useReducer } from 'react';

export type SelectedActions =
  | {
      type: 'increase';
    }
  | {
      type: 'decrease';
    }
  | {
      type: 'reset';
    }
  | {
      type: 'set-max';
      max: number;
    }
  | {
      type: 'select';
      index: number;
    };

interface State {
  max: number;
  selected: number;
}

const reducer = (state: State, action: SelectedActions): State => {
  switch (action.type) {
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
    case 'set-max':
      return {
        selected: 0,
        max: action.max,
      };
    case 'select':
      if (action.index < state.max - 1 && action.index > 0) {
        return {
          max: state.max,
          selected: action.index,
        };
      }
      error('Index out of bound');
      return state;
    default:
      throw new Error('Unknown action type');
  }
};

export const useSelected = (max: number) => {
  const [state, dispatch] = useReducer(reducer, {
    max,
    selected: 0,
  });

  useEffect(() => {
    if (max !== state.max) {
      dispatch({ type: 'set-max', max });
    }
  }, [max, state.max]);

  return [state.selected, dispatch] as const;
};
