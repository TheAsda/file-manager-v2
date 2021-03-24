import dayjs from 'dayjs';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isHiddenSync } from 'hidefile';
import { error, log } from 'electron-log';
import { FileInfo } from '../types/file-info';

export const useDirectory = (directory: string) => {
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

  const getInfo = useCallback(async () => {
    const chunk: Promise<FileInfo>[] = [];

    for (let i = 0; i < state.length; i++) {
      const newItem = getFileInfo(state[i]);
      chunk.push(newItem);
    }

    Promise.all(chunk)
      .then((data) => setState(data))
      .catch(error);
  }, [state]);

  useEffect(() => {
    if (finished) {
      return;
    }

    getInfo()
      .then(() => setFinished(true))
      .catch(error);
  }, [finished, getInfo, state]);

  const updateDirectory = () => {
    getInfo();
  };

  return { data: state, updateDirectory };
};
