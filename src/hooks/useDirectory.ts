import dayjs from 'dayjs';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';
import { useEffect, useRef, useState } from 'react';
import { isHiddenSync } from 'hidefile';
import { error, log } from 'electron-log';
import { FileInfo } from '../types/file-info';

export const useDirectory = (directory: string): FileInfo[] => {
  const [state, setState] = useState<FileInfo[]>([]);
  const [finished, setFinished] = useState(true);
  const prevDir = useRef('');

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
    if (prevDir.current !== directory) {
      prevDir.current = directory;
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
    }
  }, [directory, prevDir]);

  useEffect(() => {
    if (finished) {
      return;
    }

    const getInfo = async () => {
      const chunk: Promise<FileInfo>[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const item of state) {
        const newItem = getFileInfo(item);

        chunk.push(newItem);
      }

      Promise.all(chunk)
        .then((data) => setState(data))
        .catch(error);
    };

    getInfo()
      .then(() => setFinished(true))
      .catch(error);
  }, [finished, state]);

  return state;
};
