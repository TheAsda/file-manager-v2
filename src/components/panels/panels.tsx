import React from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Panel } from '../panel/panel';
import { usePanels } from '../../hooks/usePanels';

export const Panels = () => {
  const {
    leftPanelRef,
    rightPanelRef,
    leftPanelIsFocused,
    rightPanelIsFocused,
    onRename,
    setFocusedPanel,
  } = usePanels();

  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement className="h-full overflow-hidden">
        <Panel
          panelRef={leftPanelRef}
          isFocused={leftPanelIsFocused}
          onFocus={() => setFocusedPanel('left')}
          onRename={onRename}
        />
      </ReflexElement>
      <ReflexSplitter />
      <ReflexElement className="h-full overflow-hidden">
        <Panel
          panelRef={rightPanelRef}
          isFocused={rightPanelIsFocused}
          onFocus={() => setFocusedPanel('right')}
          onRename={onRename}
        />
      </ReflexElement>
    </ReflexContainer>
  );
};
