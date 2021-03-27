import { log } from 'electron-log';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { isDev } from '../../config';
import { useFocus, useFocusAction } from '../../hooks/useFocus';
import { useKeyMap } from '../../hooks/useKeyMap';
import { Panel } from '../panel/panel';

export const Panels = () => {
  if (isDev) {
    log('Panels rendered');
  }

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
    <ReflexContainer orientation="vertical">
      <ReflexElement>
        <Panel isFocused={focus === 'left-panel'} />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement>
        <Panel isFocused={focus === 'right-panel'} />
      </ReflexElement>
    </ReflexContainer>
  );
};
