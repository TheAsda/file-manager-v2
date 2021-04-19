import React from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { Panel } from '../panel/panel';
import { usePanels } from '../../hooks/usePanels';
import { RecentProvider } from '../../hooks/useRecent';
import { GotoPalette } from '../goto-palette/goto-palette';

export const Panels = () => {
  const {
    leftPanelRef,
    rightPanelRef,
    leftPanelIsFocused,
    rightPanelIsFocused,
    onRename,
    setFocusedPanel,
    openDirectoryInCurrent,
  } = usePanels();

  return (
    <RecentProvider>
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
      <GotoPalette openDirectory={openDirectoryInCurrent} />
    </RecentProvider>
  );
};
