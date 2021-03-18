export interface Command {
  name: string;
  handler: () => void;
  shortcut?: string;
  enabled?: boolean;
  hidden?: boolean;
}
