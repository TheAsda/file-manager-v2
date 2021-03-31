import { readdir } from 'fs-extra';
import { join } from 'path';
import { useEffect, useState } from 'react';
import { error } from 'electron-log';
import { FileInfo } from '../types/file-info';
import { getFileInfo } from '../utils/getFileInfo';

const getDirectoryInfo = async (path: string): Promise<FileInfo[]> => {
  console.log('getDirectoryInfo', path);
  try {
    const data = await readdir(path);
    const files = data.map((item) => ({
      name: item,
      path: join(path, item),
    }));

    const chunk: Promise<FileInfo>[] = [];

    for (let i = 0; i < files.length; i++) {
      chunk.push(getFileInfo(files[i]));
    }

    return Promise.all(chunk);
  } catch (err) {
    error(err);
    return [];
  }
};

export const useDirectory = (directory: string) => {
  const [state, setState] = useState<FileInfo[]>([]);

  const updateDirectory = async () => {
    setState(await getDirectoryInfo(directory));
    console.log('updateDirectory', directory);
  };

  useEffect(() => {
    updateDirectory();
  }, [directory]);

  return [state, updateDirectory] as const;
};
