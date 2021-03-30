import dayjs from 'dayjs';
import { stat } from 'fs-extra';
import { isHiddenSync } from 'hidefile';
import { FileInfo } from '../types/file-info';

export async function getFileInfo(item: FileInfo): Promise<FileInfo> {
  try {
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
  } catch {
    return {
      ...item,
      // isHidden: isHiddenSync(item.path),
      // TODO: detect attribute
      isReadonly: false,
      // TODO: detect attribute
      isSystem: true,
    };
  }
}
