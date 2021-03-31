import { renderHook, act } from '@testing-library/react-hooks';
import { normalize } from 'path';
import { usePath } from '../usePath';

const basePath = normalize('/path');
const enterPath = normalize('/path/enter');

describe('usePath', () => {
  it('should set initial path', () => {
    const { result } = renderHook(() => usePath(basePath));

    expect(result.current[0]).toEqual(basePath);
  });

  it('should not update on initial path change', () => {
    const { result, rerender } = renderHook((path) => usePath(path), {
      initialProps: basePath,
    });

    rerender('/another');

    expect(result.current[0]).toEqual(basePath);
  });

  it('should enter path', () => {
    const { result } = renderHook(() => usePath(basePath));

    act(() => {
      result.current[1]({ type: 'enter', name: 'enter' });
    });

    expect(result.current[0]).toEqual(enterPath);
  });

  it('should leave path', () => {
    const { result } = renderHook(() => usePath(enterPath));

    act(() => {
      result.current[1]({ type: 'exit' });
    });

    expect(result.current[0]).toEqual(basePath);
  });

  it('should set path', () => {
    const { result } = renderHook(() => usePath(enterPath));

    act(() => {
      result.current[1]({ type: 'set', path: basePath });
    });

    expect(result.current[0]).toEqual(basePath);
  });
});
