import React from 'react';
import { render, screen } from '@testing-library/react';
// Loaded at runtime by utils/unit-tests/envSetup.js; imported here for the matcher types.
import '@testing-library/jest-dom';
import Badge from './Badge';

describe('<Badge />', () => {
  it('should render the count', () => {
    render(<Badge count={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render nothing when the count is zero', () => {
    render(<Badge count={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should cap the count at max', () => {
    render(<Badge count={6} max={5} />);

    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.queryByText('6')).not.toBeInTheDocument();
  });

  it('should render the exact count when it equals max', () => {
    render(<Badge count={5} max={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render an empty bubble when showCount is false', () => {
    render(<Badge count={7} showCount={false} />);

    expect(screen.queryByText('7')).not.toBeInTheDocument();
    expect(document.querySelector('.theme__badge')).toBeInTheDocument();
  });

  it('should apply the shared badge class so themes can target it', () => {
    render(<Badge count={1} className="custom-position" />);

    const badge = document.querySelector('.theme__badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('custom-position');
  });
});
