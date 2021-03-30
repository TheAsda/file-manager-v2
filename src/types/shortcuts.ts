export type Shortcut =
  | 'up'
  | 'down'
  | 'openCommandPalette'
  | 'back'
  | 'activate'
  | 'switchPanel';

export type Shortcuts = Record<Shortcut, string | string[]>;
