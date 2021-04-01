import { useCallback, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron-better-ipc';
import dayjs from 'dayjs';
import { FileInfo, FileInfoSerializable } from '../types/file-info';

export const useDirectory = (directory: string) => {
  const [state, setState] = useState<FileInfo[]>([]);

  const updateDirectory = useCallback(async () => {
    const data = (await ipcRenderer.callMain(
      'get-directory',
      directory
    )) as FileInfoSerializable[];

    setState(
      data.map((item) => ({
        ...item,
        created: dayjs(item.created),
        lastModified: dayjs(item.lastModified),
      }))
    );
  }, [directory]);

  useEffect(() => {
    updateDirectory();
  }, [updateDirectory]);

  return [state, updateDirectory] as const;
};
