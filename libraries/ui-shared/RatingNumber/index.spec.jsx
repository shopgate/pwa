import React from 'react';
import {
  render,
  screen,
} from '@shopgate/pwa-unit-test/rtlUtils';
import RatingNumber from './index';

const mockNumber = jest.fn(({ number }) => <span data-testid="i18n-number">{number}</span>);

jest.mock('@shopgate/engage/components', () => ({
  I18n: {
    Number: props => mockNumber(props),
  },
}));

// One of the tests deliberately produces a react warning. The console is mocked to avoid ugly logs.
console.error = jest.fn();

describe('RatingNumber', () => {
  beforeEach(() => {
    mockNumber.mockClear();
    console.error.mockClear();
  });

  it('should render a number', () => {
    const { container } = render(<RatingNumber rating={100} className="class-test" />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockNumber).toHaveBeenCalledTimes(1);
    expect(mockNumber).toHaveBeenCalledWith(expect.objectContaining({
      number: 5,
      fractions: 2,
      className: 'class-test ui-shared__rating-number',
    }));
    expect(screen.getByTestId('i18n-number')).toHaveTextContent('5');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return when rating is null', () => {
    const { container } = render(<RatingNumber rating={null} />);

    expect(container.firstChild).toBeNull();
    expect(mockNumber).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return Number when rating is zero', () => {
    const { container } = render(<RatingNumber rating={0} />);

    expect(container.firstChild).not.toBeNull();
    expect(mockNumber).toHaveBeenCalledWith(expect.objectContaining({ number: 0 }));
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return null when division result is NaN', () => {
    const { container } = render(<RatingNumber rating={{}} />);

    expect(container.firstChild).toBeNull();
    expect(mockNumber).not.toHaveBeenCalled();
  });
});
