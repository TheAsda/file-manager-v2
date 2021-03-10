import dayjs from 'dayjs';
import { readdir, stat } from 'fs-extra';
import { join } from 'path';
import { useEffect, useState } from 'react';
import { isHiddenSync } from 'hidefile';
import { log } from 'electron-log';
import { FileInfo } from '../types/file-info';

const chunkSize = 5;

export const useDirectory = (directory: string): FileInfo[] => {
  const [state, setState] = useState<FileInfo[]>([]);
  const [finished, setFinished] = useState(true);
  const [prevDir, setPrevDir] = useState('');

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
    if (prevDir !== directory) {
      setPrevDir(directory);
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

    let chunk: FileInfo[] = [];

    state.forEach(async (item, i, arr) => {
      const newItem = await getFileInfo(item);

      if (chunk.length < chunkSize && i !== arr.length - 1) {
        chunk[i] = newItem;
      } else {
        setState((s) => {
          Object.entries(chunk).forEach(([index, value]) => {
            s[+index] = value;
          });

          return [...s];
        });
        chunk = [];
      }
    });
  }, [finished, state]);

  return state;
};
