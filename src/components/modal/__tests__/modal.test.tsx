import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { Modal } from '../modal';

const onCloseMock = jest.fn();

describe('Modal', () => {
  beforeEach(() => {
    onCloseMock.mockReset();
  });

  it('should not render if is not opened', () => {
    const component = render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div data-testid="test" />
      </Modal>
    );

    expect(component.queryByTestId('test')).toBeFalsy();
  });

  it('should render if is opened', () => {
    const component = render(
      <Modal isOpen onClose={onCloseMock}>
        <div data-testid="test" />
      </Modal>
    );

    expect(component.queryByTestId('test')).toBeTruthy();
  });

  it('should close on escape if opened', () => {
    render(
      <Modal isOpen onClose={onCloseMock}>
        <div data-testid="test" />
      </Modal>
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { keyCode: 27, key: 'Escape' })
      );
    });

    expect(onCloseMock).toBeCalledTimes(1);
  });

  it('should not close on escape if is not opened', () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div data-testid="test" />
      </Modal>
    );

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { keyCode: 27, key: 'Escape' })
      );
    });

    expect(onCloseMock).not.toBeCalled();
  });
});
