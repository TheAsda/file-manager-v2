import React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { SelectPalette } from '../select-palette';

jest.mock('../../../hooks/useKeyMap', () => ({
  useKeyMap: () => ({
    up: 'a',
    down: 'b',
    activate: 'c',
    escape: 'd',
  }),
}));

const downEvent = new KeyboardEvent('keydown', { keyCode: 66, key: 'b' });
const upEvent = new KeyboardEvent('keydown', { keyCode: 65, key: 'a' });
const activateEvent = new KeyboardEvent('keydown', { keyCode: 67, key: 'c' });
const escapeEvent = new KeyboardEvent('keydown', { keyCode: 68, key: 'd' });

const onCloseMock = jest.fn();
const onSelectMock = jest.fn();

const exampleOptions: string[] = ['option1', 'option2', 'option3'];

describe('SelectPalette', () => {
  beforeEach(() => {
    onCloseMock.mockReset();
    onSelectMock.mockReset();
  });

  it('should render', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={[]}
      />
    );

    expect(component).toBeTruthy();
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should not render options if it is closed', async () => {
    const component = render(
      <SelectPalette
        isOpen={false}
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.queryAllByRole('option');
    expect(options).toHaveLength(0);
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should render options', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];
    expect(options).toHaveLength(exampleOptions.length);
    expect(option.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should activate item on click', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];
    const option2 = options[1];

    fireEvent.click(option2);
    expect(options).toHaveLength(exampleOptions.length);
    expect(option.getAttribute('aria-selected')).toEqual('false');
    expect(option2.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[1]);
  });

  it('should select item on key down', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];
    const option2 = options[1];

    act(() => {
      document.dispatchEvent(downEvent);
    });

    expect(option.getAttribute('aria-selected')).toEqual('false');
    expect(option2.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should select item on key up', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];
    const option2 = options[1];

    act(() => {
      document.dispatchEvent(downEvent);
    });
    act(() => {
      document.dispatchEvent(upEvent);
    });

    expect(option.getAttribute('aria-selected')).toEqual('true');
    expect(option2.getAttribute('aria-selected')).toEqual('false');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should activate item on activate', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];

    act(() => {
      document.dispatchEvent(activateEvent);
    });

    expect(option.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[0]);
  });

  it('should activate next item', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];
    const option2 = options[1];

    act(() => {
      document.dispatchEvent(downEvent);
    });
    act(() => {
      document.dispatchEvent(activateEvent);
    });

    expect(option.getAttribute('aria-selected')).toEqual('false');
    expect(option2.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[1]);
  });

  it('should not activate item if closed', () => {
    render(
      <SelectPalette
        isOpen={false}
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    act(() => {
      document.dispatchEvent(downEvent);
    });
    act(() => {
      document.dispatchEvent(activateEvent);
    });

    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();
  });

  it('should not select out of bound top', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[0];

    act(() => {
      document.dispatchEvent(upEvent);
    });

    expect(option.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();

    act(() => {
      document.dispatchEvent(activateEvent);
    });

    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[0]);
  });

  it('should not select out of bound bottom', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const options = component.getAllByRole('option');
    const option = options[2];

    for (let index = 0; index < exampleOptions.length + 1; index++) {
      act(() => {
        document.dispatchEvent(downEvent);
      });
    }

    expect(option.getAttribute('aria-selected')).toEqual('true');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).not.toBeCalled();

    act(() => {
      document.dispatchEvent(activateEvent);
    });

    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[2]);
  });

  it('should close on escape', () => {
    render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    act(() => {
      document.dispatchEvent(escapeEvent);
    });

    expect(onCloseMock).toBeCalledTimes(1);
    expect(onSelectMock).not.toBeCalled();
  });

  it('should close on click out', () => {
    const component = render(
      <SelectPalette
        isOpen
        onClose={onCloseMock}
        onSelect={onSelectMock}
        options={exampleOptions}
      />
    );

    const overlay = component.baseElement.querySelector('.ReactModal__Overlay');

    expect(overlay).not.toBe(null);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireEvent.click(overlay!);
    });

    expect(onCloseMock).toBeCalledTimes(1);
    expect(onSelectMock).not.toBeCalled();
  });
});
