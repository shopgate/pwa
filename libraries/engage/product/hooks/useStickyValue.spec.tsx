import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useStickyValue from './useStickyValue';

/**
 * Renders the sticky value.
 * @returns The value.
 */
const Value = ({ value, isLoading }: { value: string | null; isLoading: boolean }) => (
  <span>{useStickyValue(value, isLoading) ?? 'empty'}</span>
);

describe('useStickyValue()', () => {
  it('keeps the last value while the next one is loading', () => {
    const { rerender } = render(<Value value="first" isLoading={false} />);

    rerender(<Value value={null} isLoading />);
    expect(screen.getByText('first')).toBeInTheDocument();

    rerender(<Value value="second" isLoading={false} />);
    expect(screen.getByText('second')).toBeInTheDocument();
  });

  it('drops the last value once loading finished without a value', () => {
    const { rerender } = render(<Value value="first" isLoading={false} />);

    rerender(<Value value={null} isLoading />);
    rerender(<Value value={null} isLoading={false} />);

    expect(screen.getByText('empty')).toBeInTheDocument();
  });
});
