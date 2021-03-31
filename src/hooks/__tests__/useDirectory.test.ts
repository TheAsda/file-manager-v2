import { waitFor } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { FileInfo } from '../../types/file-info';
import { useDirectory } from '../useDirectory';

const examplePath = '/path/';
const exampleFiles = ['file.txt', 'folder'];
const manyFilesPath = '/many/files/';

jest.mock('fs-extra', () => ({
  readdir: (path: string): string[] => {
    if (path === examplePath) {
      return exampleFiles;
    }
    if (path === manyFilesPath) {
      return Array.from(Array(500), (_, i) => `${i.toString()}.txt`);
    }

    return [exampleFiles[0]];
  },
}));

jest.mock('../../utils/getFileInfo', () => ({
  getFileInfo: (item: FileInfo): FileInfo => {
    switch (item.name) {
      case 'file.txt':
        return {
          ...item,
          isDirectory: false,
          isHidden: false,
          isReadonly: false,
          isSystem: false,
          size: 15,
        };
      case 'folder':
        return {
          ...item,
          isDirectory: true,
          isHidden: false,
          isReadonly: false,
          isSystem: false,
          size: 0,
        };
      default:
        return item;
    }
  },
}));

describe('useDirectory', () => {
  it('should set initial value', () => {
    const { result } = renderHook(() => useDirectory(examplePath));

    waitFor(() => {
      return expect(result.current[0].map((item) => item.name)).toEqual(
        exampleFiles
      );
    });
  });

  it('should update on path change', async () => {
    const { result, rerender } = renderHook(
      (path: string) => useDirectory(path),
      {
        initialProps: examplePath,
      }
    );

    await waitFor(() => {
      return expect(result.current[0].map((item) => item.name)).toEqual(
        exampleFiles
      );
    });

    rerender('/another/');

    await waitFor(() => {
      return expect(result.current[0].map((item) => item.name)).toEqual([
        exampleFiles[0],
      ]);
    });
  });

  it('should return with many files', () => {
    const { result } = renderHook(() => useDirectory(manyFilesPath));

    waitFor(() => {
      return expect(result.current[0]).toHaveLength(500);
    });
  });

  it('should update directory on call', () => {
    const { result } = renderHook(() => useDirectory(examplePath));

    const directoryState = result.current[0];

    act(() => {
      result.current[1]();
    });

    waitFor(() => {
      return expect(directoryState === result.current[0]).toBe(false);
    });
  });
});
