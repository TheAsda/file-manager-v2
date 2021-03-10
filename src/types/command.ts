export interface Command {
  name: string;
  handler: () => void;
}
