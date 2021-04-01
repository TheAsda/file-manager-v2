import { renderHook, act } from '@testing-library/react-hooks';
import { FileInfoSerializable } from '../../types/file-info';
import { useDirectory } from '../useDirectory';

const examplePath = '/path/';
const exampleFiles = ['file.txt', 'folder'];

jest.mock('electron-better-ipc', () => ({
  ipcRenderer: {
    callMain: (_: unknown, path: string): FileInfoSerializable[] => {
      switch (path) {
        case '/path/':
          return [
            {
              name: 'file.txt',
              path: '/path/file.txt',
              isDirectory: false,
            },
            {
              name: 'folder',
              path: '/path/folder',
              isDirectory: true,
            },
          ];
        default:
          return [];
      }
    },
  },
}));

describe('useDirectory', () => {
  it('should set initial value', async () => {
    const { result, waitFor } = renderHook(() => useDirectory(examplePath));

    await waitFor(() => {
      return expect(result.current[0].map((item) => item.name)).toEqual(
        exampleFiles
      );
    });
  });

  it('should update on path change', async () => {
    const { result, rerender, waitFor } = renderHook(
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

    act(() => {
      rerender('/another/');
    });

    await waitFor(() => {
      return expect(result.current[0]).toHaveLength(0);
    });
  });

  it('should update directory on call', async () => {
    const { result, waitFor } = renderHook(() => useDirectory(examplePath));

    const directoryState = result.current[0];

    act(() => {
      result.current[1]();
    });

    await waitFor(() => {
      return expect(directoryState === result.current[0]).toBe(false);
    });
  });
});
