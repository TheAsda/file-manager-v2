import { Dayjs } from 'dayjs';

export interface DirectoryInfo {
  folders: FileInfo[];
  files: FileInfo[];
}

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

export interface FileInfoSerializable {
  path: string;
  name: string;
  size?: number;
  lastModified?: string;
  created?: string;
  isDirectory?: boolean;
  isHidden?: boolean;
  isReadonly?: boolean;
  isSystem?: boolean;
}
