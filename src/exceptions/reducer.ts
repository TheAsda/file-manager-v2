export class UnknownActionTypeError extends Error {
  constructor() {
    super('Unknown action type');
    this.name = 'UnknownActionTypeError';
  }
}
