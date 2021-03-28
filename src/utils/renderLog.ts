import { log } from 'electron-log';
import { isDev } from '../config';

const components: Record<string, number> = {};

export function renderLog(name: string) {
  if (isDev) {
    if (!Object.keys(components).includes(name)) {
      components[name] = 1;
    } else {
      components[name] += 1;
    }
    log(`Render`, `${name}: ${components[name]}`, components);
  }
}
