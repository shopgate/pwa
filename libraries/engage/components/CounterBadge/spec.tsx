import React from 'react';
import { render, screen } from '@testing-library/react';
// Loaded at runtime by utils/unit-tests/envSetup.js; imported here for the matcher types.
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import CounterBadge from './CounterBadge';

// ThemeProvider resolves the active breakpoint via matchMedia, which jsdom doesn't implement.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

const theme = createTheme();

/**
 * Renders the subject within a theme context.
 * @param ui The element to render.
 * @returns The render result.
 */
const renderWithTheme = (ui: React.ReactElement) => render(
  <ThemeProvider theme={theme}>{ui}</ThemeProvider>
);

describe('<CounterBadge />', () => {
  it('should render the count', () => {
    renderWithTheme(<CounterBadge count={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render nothing when the count is zero', () => {
    renderWithTheme(<CounterBadge count={0} />);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should cap the count at max', () => {
    renderWithTheme(<CounterBadge count={6} max={5} />);

    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.queryByText('6')).not.toBeInTheDocument();
  });

  it('should render the exact count when it equals max', () => {
    renderWithTheme(<CounterBadge count={5} max={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render an empty bubble when showCount is false', () => {
    renderWithTheme(<CounterBadge count={7} showCount={false} />);

    expect(screen.queryByText('7')).not.toBeInTheDocument();
    expect(document.querySelector('.theme__badge')).toBeInTheDocument();
  });

  it('should apply the shared badge class so themes can target it', () => {
    renderWithTheme(<CounterBadge count={1} className="custom-position" />);

    const badge = document.querySelector('.theme__badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('custom-position');
  });
});
