import { ipcRenderer } from 'electron-better-ipc';
import { join } from 'path';

export const createFile = async (name: string, path: string) => {
  await ipcRenderer.callMain('create-file', { path, name });
};

export const createFolder = async (name: string, path: string) => {
  await ipcRenderer.callMain('create-folder', { path, name });
};

export const rename = async (
  oldName: string,
  newName: string,
  path: string
) => {
  await ipcRenderer.callMain('rename', {
    oldPath: join(path, oldName),
    newPath: join(path, newName),
  });
};
