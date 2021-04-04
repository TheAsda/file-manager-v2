import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { ConfirmModal } from '../confirm-modal';

const onOkMock = jest.fn();
const onCloseMock = jest.fn();

describe('ConfirmPopup', () => {
  beforeEach(() => {
    onOkMock.mockReset();
    onCloseMock.mockReset();
  });

  it('should render', () => {
    const component = render(
      <ConfirmModal
        isOpen
        onClose={onCloseMock}
        onOk={onOkMock}
        title="title"
      />
    );

    expect(component).toBeTruthy();
    expect(onOkMock).not.toBeCalled();
    expect(onCloseMock).not.toBeCalled();
  });

  it('should not render if is closed', () => {
    const component = render(
      <ConfirmModal
        isOpen={false}
        onClose={onCloseMock}
        onOk={onOkMock}
        title="title"
      />
    );

    expect(component.queryByTestId('confirm-modal')).toBeFalsy();
    expect(onOkMock).not.toBeCalled();
    expect(onCloseMock).not.toBeCalled();
  });

  it('should close on cancel click', () => {
    const component = render(
      <ConfirmModal
        isOpen
        onClose={onCloseMock}
        onOk={onOkMock}
        title="title"
      />
    );

    fireEvent.click(component.getByText('Cancel'));

    expect(onOkMock).not.toBeCalled();
    expect(onCloseMock).toBeCalledTimes(1);
  });

  it('should ok on ok button click', () => {
    const component = render(
      <ConfirmModal
        isOpen
        onClose={onCloseMock}
        onOk={onOkMock}
        title="title"
      />
    );

    fireEvent.click(component.getByText('Ok'));

    expect(onCloseMock).not.toBeCalled();
    expect(onOkMock).toBeCalledTimes(1);
  });
});
