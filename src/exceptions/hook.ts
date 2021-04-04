export class ContextError extends Error {
  constructor(hookName: string) {
    super(`${hookName} must be within provider`);
    this.name = 'ContextError';
  }
}
