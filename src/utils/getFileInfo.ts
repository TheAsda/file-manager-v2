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
      // stat has incorrect interface. Dates are dates are actually strings
      created: (data.birthtime as unknown) as string,
      lastModified: (data.mtime as unknown) as string,
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
