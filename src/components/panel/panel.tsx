import dayjs from 'dayjs';
import { log } from 'electron-log';
import React from 'react';
import { isDev } from '../../config';
import { Explorer } from '../explorer/explorer';

export const Panel = () => {
  if (isDev) {
    log('Panel rendered');
  }

  return (
    <div>
      <Explorer
        data={[
          {
            name: 'file.txt',
            path: 'C:\\file.txt',
            created: dayjs(),
            lastModified: dayjs(),
            isDirectory: false,
            size: 123,
          },
          {
            name: 'folder',
            path: 'C:\\folder',
            created: dayjs(),
            lastModified: dayjs(),
            isDirectory: true,
            size: 0,
          },
        ]}
      />
    </div>
  );
};
