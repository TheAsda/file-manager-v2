import React from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Panel } from '../panel/panel';
import styles from './styles.module.css';

export const Panels = () => {
  return (
    <ReflexContainer orientation="vertical" className={styles.panels}>
      <ReflexElement>
        <Panel />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement>
        <Panel />
      </ReflexElement>
    </ReflexContainer>
  );
};
