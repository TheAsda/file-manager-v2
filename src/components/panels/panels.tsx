import { log } from 'electron-log';
import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { isDev } from '../../config';
import { useKeyMap } from '../../hooks/useKeyMap';
import { Panel } from '../panel/panel';
import styles from './styles.module.css';

export const Panels = () => {
  if (isDev) {
    log('Panels rendered');
  }

  const { switchPanel } = useKeyMap();
  const [focused, setFocused] = useState<'left' | 'right'>('left');

  useHotkeys(switchPanel, () =>
    setFocused((s) => (s === 'left' ? 'right' : 'left'))
  );

  return (
    <ReflexContainer orientation="vertical" className={styles.panels}>
      <ReflexElement>
        <Panel isFocused={focused === 'left'} />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement>
        <Panel isFocused={focused === 'right'} />
      </ReflexElement>
    </ReflexContainer>
  );
};
