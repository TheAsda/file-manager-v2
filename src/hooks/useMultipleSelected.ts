import { error } from 'electron-log';
import { useEffect, useReducer } from 'react';

export type MultipleSelectedActions =
  | {
      type: 'select';
      index: number;
    }
  | {
      type: 'select-next';
      include?: boolean;
    }
  | {
      type: 'select-prev';
      include?: boolean;
    }
  | {
      type: 'reset';
      index?: number;
    }
  | {
      type: 'set-max';
      max: number;
    };

interface State {
  max: number;
  selected: number[];
  lastSelected: number;
}

const reducer = (state: State, action: MultipleSelectedActions): State => {
  switch (action.type) {
    case 'select':
      if (action.index < state.max && action.index >= 0) {
        return {
          max: state.max,
          selected: [action.index],
          lastSelected: action.index,
        };
      }
      error('Index out of bound');
      return state;
    case 'select-next':
      if (state.lastSelected < state.max - 1) {
        const newIndex = state.lastSelected + 1;
        if (action.include === true) {
          if (state.selected.includes(newIndex)) {
            state.selected.splice(
              state.selected.indexOf(state.lastSelected),
              1
            );
            return {
              max: state.max,
              selected: state.selected,
              lastSelected: newIndex,
            };
          }

          return {
            max: state.max,
            selected: [...state.selected, newIndex],
            lastSelected: newIndex,
          };
        }

        return {
          max: state.max,
          selected: [newIndex],
          lastSelected: newIndex,
        };
      }
      return { ...state };
    case 'select-prev':
      if (state.lastSelected > 0) {
        const newIndex = state.lastSelected - 1;
        if (action.include === true) {
          if (state.selected.includes(newIndex)) {
            state.selected.splice(
              state.selected.indexOf(state.lastSelected),
              1
            );
            return {
              max: state.max,
              selected: state.selected,
              lastSelected: newIndex,
            };
          }

          return {
            max: state.max,
            selected: [...state.selected, newIndex],
            lastSelected: newIndex,
          };
        }
        return {
          max: state.max,
          selected: [newIndex],
          lastSelected: newIndex,
        };
      }
      return { ...state };
    case 'reset':
      if (action.index !== undefined) {
        return {
          max: state.max,
          selected: [action.index],
          lastSelected: action.index,
        };
      }

      return {
        max: state.max,
        selected: [0],
        lastSelected: 0,
      };
    case 'set-max':
      return {
        selected: [0],
        max: action.max,
        lastSelected: 0,
      };
    default:
      throw new Error('Unknown action type');
  }
};

export const useMultipleSelected = (max: number) => {
  const [state, dispatch] = useReducer(reducer, {
    max,
    selected: [0],
    lastSelected: 0,
  });

  useEffect(() => {
    if (max !== state.max) {
      dispatch({ type: 'set-max', max });
    }
  }, [max, state.max]);

  return [state.selected, state.lastSelected, dispatch] as const;
};
