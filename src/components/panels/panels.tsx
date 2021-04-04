import React, { useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import { join } from 'path';
import { error } from 'electron-log';
import { useKeyMap } from '../../hooks/useKeyMap';
import { Panel, PanelRef } from '../panel/panel';
import { Command } from '../../types/command';
import { useRegisterCommands } from '../../hooks/useCommands';
import { useInputModal } from '../../hooks/useInputModal';
import { createFile, createFolder, rename, trash } from '../../utils/fsActions';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';

export const Panels = () => {
  const { switchPanel } = useKeyMap();
  const { openInputModal, isOpen: inputModalIsOpen } = useInputModal();
  const { openConfirmDialog, isOpen: confirmDialogIsOpen } = useConfirmDialog();
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

  const onRename = async (newName: string, oldName: string, path: string) => {
    await rename(newName, oldName, path);
    currentPanelRef.current?.updateDirectory?.();
  };

  useHotkeys(switchPanel, togglePanel, {
    enabled: !inputModalIsOpen && !confirmDialogIsOpen,
  });

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
            onComplete: async (value) => {
              await createFile(value, path);
              updateDirectory();
            },
            elementToFocus: currentElement,
          });
        },
      },
      {
        name: 'New folder',
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
            title: 'New folder',
            onComplete: async (value) => {
              await createFolder(value, path);
              updateDirectory();
            },
            elementToFocus: currentElement,
          });
        },
      },
      {
        name: 'Rename',
        handler: () => {
          if (currentPanelRef.current === undefined) {
            return;
          }
          const { startRename } = currentPanelRef.current;

          startRename();
        },
      },
      {
        name: 'Delete',
        handler: async () => {
          if (currentPanelRef.current === undefined) {
            return;
          }
          const {
            currentItem,
            currentElement,
            updateDirectory,
          } = currentPanelRef.current;
          const path = join(currentItem.path, currentItem.name);

          openConfirmDialog({
            title: 'Are you sure you want to delete this item?',
            onOk: async () => {
              try {
                await trash(path);
                updateDirectory();
              } catch (err) {
                error(err);
              }
            },
            elementToFocus: currentElement,
          });
        },
      },
    ] as Command[];
  }, [currentPanelRef, openConfirmDialog, openInputModal]);

  useRegisterCommands('panels', commands);

  const leftPanelIsFocused =
    focusedPanel === 'left' && !inputModalIsOpen && !confirmDialogIsOpen;
  const rightPanelIsFocused =
    focusedPanel === 'right' && !inputModalIsOpen && !confirmDialogIsOpen;

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
