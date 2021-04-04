export type Shortcut =
  | 'up'
  | 'down'
  | 'openCommandPalette'
  | 'back'
  | 'activate'
  | 'switchPanel'
  | 'rename';

export type Shortcuts = Record<Shortcut, string | string[]>;
