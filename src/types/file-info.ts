import { Dayjs } from 'dayjs';

export interface FileInfo {
  /** The full path to this directory item. */
  path: string;

  /** The display name of the directory item. */
  name: string;

  /** The size (in bytes) of the file, if any. */
  size?: number;

  /** The last time the directory item was modified. */
  lastModified?: Dayjs;

  /** The date time the directory item was created. */
  created?: Dayjs;

  isDirectory?: boolean;

  isHidden?: boolean;

  isReadonly?: boolean;

  isSystem?: boolean;
}
