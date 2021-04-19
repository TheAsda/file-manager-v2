import { error } from 'electron-log';
import { join } from 'path';
import { useState, useRef, useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PanelRef } from '../components/panel/panel';
import { Command } from '../types/command';
import { createFile, createFolder, rename, trash } from '../utils/fsActions';
import { useRegisterCommands } from './useCommands';
import { useConfirmDialog } from './useConfirmDialog';
import { useInputModal } from './useInputModal';
import { useKeyMap } from './useKeyMap';

export const usePanels = () => {
  const { switchPanel } = useKeyMap();
  const { isOpen: inputModalIsOpen, openInputModal } = useInputModal();
  const { isOpen: confirmDialogIsOpen, openConfirmDialog } = useConfirmDialog();
  const [focusedPanel, setFocusedPanel] = useState<'left' | 'right'>('left');
  const leftPanelRef = useRef<PanelRef>();
  const rightPanelRef = useRef<PanelRef>();
  const currentPanelRef = useRef<PanelRef>();
  const otherPanelRef = useRef<PanelRef>();

  currentPanelRef.current =
    focusedPanel === 'left' ? leftPanelRef.current : rightPanelRef.current;
  otherPanelRef.current =
    focusedPanel === 'left' ? rightPanelRef.current : leftPanelRef.current;

  const updateCurrentDirectory = useCallback(() => {
    currentPanelRef.current?.updateDirectory?.();
    if (currentPanelRef.current?.path === otherPanelRef.current?.path) {
      otherPanelRef.current?.updateDirectory?.();
    }
  }, []);

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

  const openDirectoryInCurrent = (path: string) => {
    currentPanelRef.current?.setPath(path);
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
          const { path, currentElement } = currentPanelRef.current;

          openInputModal({
            title: 'New file',
            onComplete: async (value) => {
              await createFile(value, path);
              updateCurrentDirectory();
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
          const { path, currentElement } = currentPanelRef.current;

          openInputModal({
            title: 'New folder',
            onComplete: async (value) => {
              await createFolder(value, path);
              updateCurrentDirectory();
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
          const { currentItems, currentElement } = currentPanelRef.current;

          if (currentItems.length === 1) {
            const path = join(currentItems[0].path, currentItems[0].name);

            openConfirmDialog({
              title: 'Are you sure you want to delete this item?',
              onOk: async () => {
                try {
                  await trash(path);
                  updateCurrentDirectory();
                } catch (err) {
                  error(err);
                }
              },
              elementToFocus: currentElement,
            });
          } else {
            const paths = currentItems.map((item) =>
              join(item.path, item.name)
            );

            openConfirmDialog({
              title: `Are you sure you want to delete ${paths.length} items`,
              onOk: async () => {
                try {
                  await Promise.all(paths.map((path) => trash(path)));
                  updateCurrentDirectory();
                } catch (err) {
                  error(err);
                }
              },
              elementToFocus: currentElement,
            });
          }
        },
      },
    ] as Command[];
  }, [openConfirmDialog, openInputModal, updateCurrentDirectory]);

  useRegisterCommands('panels', commands);

  const leftPanelIsFocused =
    focusedPanel === 'left' && !inputModalIsOpen && !confirmDialogIsOpen;
  const rightPanelIsFocused =
    focusedPanel === 'right' && !inputModalIsOpen && !confirmDialogIsOpen;

  return {
    leftPanelRef,
    rightPanelRef,
    leftPanelIsFocused,
    rightPanelIsFocused,
    onRename,
    updateCurrentDirectory,
    setFocusedPanel,
    openDirectoryInCurrent,
  };
};
