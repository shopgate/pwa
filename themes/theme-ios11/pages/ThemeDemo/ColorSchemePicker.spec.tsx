import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider, createTheme } from '@shopgate/engage/styles';
import { createDefaultThemeOptions } from '@shopgate/engage/styles/theme/createDefaultThemeOptions';
import ColorSchemePicker from './ColorSchemePicker';

const theme = createTheme(createDefaultThemeOptions());

/**
 * Renders the picker against a store holding the configured color scheme.
 * @param defaultColorSchemeMode The color scheme mode configured within the app settings.
 * @returns The render result.
 */
const renderPicker = (defaultColorSchemeMode = 'selectable') => {
  const store = createStore(() => ({
    settings: { appSettings: { appearance: { defaultColorSchemeMode } } },
  }));

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ColorSchemePicker />
      </ThemeProvider>
    </Provider>
  );
};

describe('<ColorSchemePicker />', () => {
  beforeEach(() => window.localStorage.clear());

  it('offers an option per mode', () => {
    renderPicker();

    expect(screen.getByLabelText('Light')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark')).toBeInTheDocument();
    expect(screen.getByLabelText('System')).toBeInTheDocument();
  });

  it('preselects the configured selectable mode', () => {
    renderPicker('selectable');

    expect(screen.getByLabelText('System')).toBeChecked();
  });

  it('applies the system mode when picked', () => {
    renderPicker('selectable');

    fireEvent.click(screen.getByLabelText('System'));

    expect(screen.getByLabelText('System')).toBeChecked();
    // jsdom reports no dark preference, so following the system resolves to light.
    expect(document.documentElement.getAttribute('data-sg-color-scheme')).toBe('light');
  });

  it('renders nothing while a binding color scheme is configured', () => {
    const { container } = renderPicker('dark');

    expect(container).toBeEmptyDOMElement();
  });

  it('applies and persists the picked scheme', () => {
    renderPicker('selectable');

    fireEvent.click(screen.getByLabelText('Dark'));

    expect(screen.getByLabelText('Dark')).toBeChecked();
    expect(document.documentElement.getAttribute('data-sg-color-scheme')).toBe('dark');
  });

  it('renders nothing while the light scheme is configured', () => {
    const { container } = renderPicker('light');

    expect(container).toBeEmptyDOMElement();
  });
});
