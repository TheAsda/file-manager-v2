import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useFocus, useFocusAction } from '../../hooks/useFocus';
import { useKeyMap } from '../../hooks/useKeyMap';
import { renderLog } from '../../utils/renderLog';
import { Panel } from '../panel/panel';

export const Panels = () => {
  renderLog('Panels');

  const { switchPanel } = useKeyMap();
  const focus = useFocus();
  const focusAction = useFocusAction();

  useHotkeys(
    switchPanel,
    () =>
      focusAction((s) => {
        switch (s) {
          case 'left-panel':
            return 'right-panel';
          case 'right-panel':
            return 'left-panel';
          default:
            return s;
        }
      }),
    { enabled: focus === 'left-panel' || focus === 'right-panel' }
  );

  return (
    <ReflexContainer orientation="vertical" className="max-h-screen w-screen">
      <ReflexElement className="h-full overflow-hidden">
        <Panel
          isFocused={focus === 'left-panel'}
          onFocus={() => focusAction('left-panel')}
        />
      </ReflexElement>
      <ReflexSplitter className="z-0" />
      <ReflexElement className="h-full overflow-hidden">
        <Panel
          isFocused={focus === 'right-panel'}
          onFocus={() => focusAction('right-panel')}
        />
      </ReflexElement>
    </ReflexContainer>
  );
};
