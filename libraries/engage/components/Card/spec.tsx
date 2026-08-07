import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import type { CardSettings } from '@shopgate/engage/settings/types/appSettings';
import Card from './Card';

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

const styleText = () => Array.from(document.styleSheets)
  .flatMap((sheet) => {
    try {
      return Array.from(sheet.cssRules);
    } catch {
      return [];
    }
  })
  .map(rule => rule.cssText)
  .join('');

const renderCard = (
  ui: React.ReactElement,
  cards: CardSettings = {
    style: 'shadow',
    shadow: { size: 'medium' },
  }
) => {
  const store = createStore(() => ({ settings: { appSettings: { cards } } }));

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </Provider>
  );
};

describe('<Card />', () => {
  it('passes id, className and children through', () => {
    renderCard(<Card id="c1" className="custom" data-testid="card">body</Card>);
    const el = screen.getByTestId('card');

    expect(el).toHaveAttribute('id', 'c1');
    expect(el).toHaveTextContent('body');
    expect(el).toHaveClass('custom');
  });

  it('emits the engage__card, ui-shared__card and engage__paper classes', () => {
    renderCard(<Card data-testid="card">x</Card>);
    const el = screen.getByTestId('card');

    expect(el).toHaveClass('engage__card');
    expect(el).toHaveClass('ui-shared__card');
    expect(el).toHaveClass('engage__paper');
  });

  it('draws a shadow for the configured shadow style', () => {
    renderCard(<Card data-testid="card">x</Card>, {
      style: 'shadow',
      shadow: { size: 'medium' },
    });

    expect(styleText()).toContain('var(--sg-palette-shadow)');
  });

  it('draws the card border for the configured border style', () => {
    renderCard(<Card data-testid="card">x</Card>, {
      style: 'border',
      shadow: { size: 'none' },
    });

    expect(styleText()).toContain('var(--sg-components-cards-border)');
  });

  it('lets an explicit variant override the configured appearance', () => {
    renderCard(
      <Card variant="outlined" data-testid="card">x</Card>,
      {
        style: 'shadow',
        shadow: { size: 'medium' },
      }
    );

    expect(styleText()).toContain('var(--sg-components-cards-border)');
  });

  it('renders the plain variant', () => {
    renderCard(<Card variant="plain" data-testid="card">x</Card>);
    const el = screen.getByTestId('card');

    expect(el).toHaveClass('engage__card');
    expect(el).toHaveClass('engage__paper');
  });
});
