import { ipcMain } from 'electron-better-ipc';
import { error } from 'electron-log';
import { readdir } from 'fs-extra';
import { join } from 'path';
import { FileInfoSerializable } from '../types/file-info';
import { getFileInfo } from '../utils/getFileInfo';

export function registerIpc() {
  ipcMain.answerRenderer(
    'get-directory',
    async (path: string): Promise<FileInfoSerializable[]> => {
      try {
        const data = await readdir(path);
        const files = data.map((item) => ({
          name: item,
          path: join(path, item),
        }));

        const chunk: Promise<FileInfoSerializable>[] = [];

        for (let i = 0; i < files.length; i++) {
          chunk.push(getFileInfo(files[i]));
        }

        return await Promise.all(chunk);
      } catch (err) {
        error(err);
        return [];
      }
    }
  );
}
