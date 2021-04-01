import { stat } from 'fs-extra';
import { FileInfoSerializable } from '../types/file-info';

export async function getFileInfo(
  item: FileInfoSerializable
): Promise<FileInfoSerializable> {
  try {
    const data = await stat(item.path);
    return {
      ...item,
      size: data.size,
      created: data.birthtime.toISOString(),
      lastModified: data.mtime.toISOString(),
      isDirectory: data.isDirectory(),
      // isHidden: isHiddenSync(item.path),
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
