import { ipcMain } from 'electron-better-ipc';
import { error } from 'electron-log';
import { readdir, createFile, mkdirp, rename } from 'fs-extra';
import { join } from 'path';
import trash from 'trash';
import { FileInfoSerializable } from '../types/file-info';
import { getFileInfo } from '../utils/getFileInfo';

export function registerIpc() {
  ipcMain.answerRenderer(
    'get-directory',
    async (path: string): Promise<FileInfoSerializable[]> => {
      if (!path) {
        throw new Error('Data is not specified');
      }

      try {
        const data = await readdir(path);
        const files = data.map((item) => ({
          name: item,
          path,
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

  ipcMain.answerRenderer(
    'create-file',
    async (data: { path: string; name: string }) => {
      if (!data) {
        throw new Error('Data is not specified');
      }

      try {
        await createFile(join(data.path, data.name));
      } catch (err) {
        error(err);
        throw new Error('Cannot create file');
      }
    }
  );

  ipcMain.answerRenderer(
    'create-folder',
    async (data: { path: string; name: string }) => {
      if (!data) {
        throw new Error('Data is not specified');
      }

      try {
        await mkdirp(join(data.path, data.name));
      } catch (err) {
        error(err);
        throw new Error('Cannot create folder');
      }
    }
  );

  ipcMain.answerRenderer(
    'rename',
    async (data: { oldPath: string; newPath: string }) => {
      if (!data) {
        throw new Error('Data is not provided');
      }

      try {
        await rename(data.oldPath, data.newPath);
      } catch (err) {
        error(err);
        throw new Error('Cannot rename file');
      }
    }
  );

  ipcMain.answerRenderer('trash', async (path: string) => {
    if (!path) {
      throw new Error('Path is not specified');
    }

    try {
      await trash(path);
    } catch (err) {
      error(err);
      throw new Error('Cannot trash path');
    }
  });
}
