export type Shortcut =
  | 'up'
  | 'down'
  | 'openCommandPalette'
  | 'back'
  | 'activate'
  | 'switchPanel'
  | 'rename'
  | 'selectMultipleNext'
  | 'selectMultiplePrev'
  | 'delete'
  | 'deletePermanently'
  | 'move'
  | 'openGotoPalette';

export type Shortcuts = Record<Shortcut, string | string[]>;
