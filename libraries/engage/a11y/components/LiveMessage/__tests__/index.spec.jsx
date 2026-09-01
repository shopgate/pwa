import React from 'react';
import { render, screen } from '@testing-library/react';
import LiveMessage from '../index';

const mockText = jest.fn(({ string }) => string);

jest.mock('../../../../components', () => ({
  I18n: {
    Text: props => mockText(props),
  },
}));

describe('<LiveMessage />', () => {
  const message = 'My Message';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a polite simple message', () => {
    const ariaLive = 'polite';
    render(<LiveMessage message={message} />);
    const liveRegion = screen.getByRole('log');

    expect(liveRegion).toMatchSnapshot();
    expect(liveRegion).toHaveAttribute('aria-live', ariaLive);
    expect(mockText).toHaveBeenCalledTimes(1);
    expect(mockText.mock.calls[0][0]).toEqual({
      string: message,
      params: null,
    });
  });

  it('should render an assertive message with params ', () => {
    const ariaLive = 'assertive';
    const params = { my: 'param' };
    render(
      <LiveMessage message={message} params={params} aria-live={ariaLive} />
    );
    const liveRegion = screen.getByRole('log');

    expect(liveRegion).toMatchSnapshot();
    expect(liveRegion).toHaveAttribute('aria-live', ariaLive);
    expect(mockText).toHaveBeenCalledTimes(1);
    expect(mockText.mock.calls[0][0]).toEqual({
      string: message,
      params,
    });
  });
});

