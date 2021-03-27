import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { SelectPalette } from '../select-palette';

jest.mock('../../../hooks/useKeyMap', () => ({
  useKeyMap: () => ({
    up: 'a',
    down: 'b',
    activate: 'c',
  }),
}));

const onCloseMock = jest.fn();
const onSelectMock = jest.fn();

const exampleOptions: string[] = ['option1', 'option2', 'option3'];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function triggerKeyboardEvent(el, keyCode) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const eventObj = document.createEventObject
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.createEventObject()
    : document.createEvent('Events');
  if (eventObj.initEvent) {
    eventObj.initEvent('keydown', true, true);
  }
  if (keyCode) {
    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;
  }
  // if (opt) {
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const a in opt) {
  //     if (Object.prototype.hasOwnProperty.call(opt, a)) {
  //       eventObj[a] = opt[a];
  //     }
  //   }
  // }
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.dispatchEvent
    ? el.dispatchEvent(eventObj)
    : el.fireEvent('onkeydown', eventObj);
}

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

  it('should select item on click', () => {
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

  it('should select next item on down key', async () => {
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

    expect(options).toHaveLength(exampleOptions.length);

    triggerKeyboardEvent(component.container, 'b');
    await waitFor(() =>
      expect(option2.getAttribute('aria-selected')).toEqual('true')
    );
    expect(option.getAttribute('aria-selected')).toEqual('false');
    expect(onCloseMock).not.toBeCalled();
    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toBeCalledWith(exampleOptions[1]);
  });
});
