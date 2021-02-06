import dayjs from 'dayjs';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';
import { useEffect, useState } from 'react';
import { isHiddenSync } from 'hidefile';
import { log } from 'electron-log';
import { FileInfo } from '../types/file-info';

export const useDirectory = (directory: string): FileInfo[] => {
  const [state, setState] = useState<FileInfo[]>([]);
  const [finished, setFinished] = useState(true);

  const getFileInfo = async (item: FileInfo): Promise<FileInfo> => {
    const data = await stat(item.path);

    return {
      ...item,
      size: data.size,
      created: dayjs(data.birthtime),
      lastModified: dayjs(data.mtime),
      isDirectory: data.isDirectory(),
      isHidden: isHiddenSync(item.path),
      // TODO: detect attribute
      isReadonly: false,
      // TODO: detect attribute
      isSystem: false,
    };
  };

  useEffect(() => {
    readdir(directory, (err, files) => {
      if (err) {
        log(err);
        setState([]);
        return;
      }

      setState(
        files.map((item) => ({
          name: item,
          path: join(directory, item),
        }))
      );
      setFinished(false);
    });
  }, [directory]);

  useEffect(() => {
    if (finished) {
      return;
    }

    state.forEach(async (item, i) => {
      const newItem = await getFileInfo(item);

      setState((s) => {
        s[i] = newItem;

        return [...s];
      });
    });
  }, [finished, state]);

  return state;
};
