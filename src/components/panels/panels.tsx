import { error } from 'electron-log';
import { createFile } from 'fs-extra';
import { join } from 'path';
import React, { useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { useKeyMap } from '../../hooks/useKeyMap';
import { Panel, PanelRef } from '../panel/panel';
import { StatusBar } from '../status-bar/status-bar';
import { Command } from '../../types/command';
import { useRegisterCommands } from '../../hooks/useCommands';
import { useInputModal } from '../../hooks/useInputModal';

export const Panels = () => {
  const { switchPanel } = useKeyMap();
  const { openInputModal, isOpened } = useInputModal();
  const [focusedPanel, setFocusedPanel] = useState<'left' | 'right'>('left');
  const leftPanelRef = useRef<PanelRef>();
  const rightPanelRef = useRef<PanelRef>();

  const currentPanelRef =
    focusedPanel === 'left' ? leftPanelRef : rightPanelRef;
  const otherPanelRef = focusedPanel === 'left' ? rightPanelRef : leftPanelRef;

  const togglePanel = () => {
    setFocusedPanel((s) => {
      otherPanelRef.current?.currentElement?.focus();

      return s === 'left' ? 'right' : 'left';
    });
  };

  useHotkeys(switchPanel, togglePanel, { enabled: !isOpened });

  const commands = useMemo(() => {
    return [
      {
        name: 'New file',
        handler: () => {
          if (currentPanelRef.current === undefined) {
            return;
          }
          const {
            path,
            updateDirectory,
            currentElement,
          } = currentPanelRef.current;

          openInputModal({
            title: 'New file',
            onComplete: (value) => {
              createFile(join(path, value))
                .then(() => {
                  return updateDirectory();
                })
                .catch(error);
            },
            elementToFocus: currentElement,
          });
        },
      },
      {
        name: 'New folder',
        handler: () => {
          openInputModal({ title: 'New folder', onComplete: () => {} });
        },
      },
      {
        name: 'Rename',
        handler: () => {},
      },
    ] as Command[];
  }, [currentPanelRef, openInputModal]);

  useRegisterCommands('panels', commands);

  return (
    <div className="h-screen w-screen panels">
      <ReflexContainer orientation="vertical" className="panels-content">
        <ReflexElement className="h-full overflow-hidden">
          <Panel
            panelRef={leftPanelRef}
            isFocused={focusedPanel === 'left'}
            onFocus={() => setFocusedPanel('left')}
          />
        </ReflexElement>
        <ReflexSplitter />
        <ReflexElement className="h-full overflow-hidden">
          <Panel
            panelRef={rightPanelRef}
            isFocused={focusedPanel === 'right'}
            onFocus={() => setFocusedPanel('right')}
          />
        </ReflexElement>
      </ReflexContainer>
      <div className="panels-status-bar">
        <StatusBar />
      </div>
    </div>
  );
};
