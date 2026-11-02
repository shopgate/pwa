import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { setIconOverrides } from '../../helpers/overrides';
import ThemeIcon from './ThemeIcon';

jest.mock('../../helpers/themeIcons', () => ({
  ...jest.requireActual('../../helpers/themeIcons'),
  getLegacyThemeIcons: () => ({}),
}));

describe('engage > icons > components > ThemeIcon', () => {
  afterEach(() => {
    act(() => {
      setIconOverrides(null);
    });
  });

  it('renders a core icon by its name', () => {
    const { container } = render(<ThemeIcon name="calendar" />);

    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 29.121 29.121');
  });

  it('switches to an override and back when the overrides change', () => {
    const { container } = render(<ThemeIcon name="cart" />);
    const svg = () => container.querySelector('svg');

    act(() => {
      setIconOverrides({ cart: { svg: '<svg viewBox="0 0 48 48"><path d="M1 1"/></svg>' } });
    });

    expect(svg()?.getAttribute('viewBox')).toBe('0 0 48 48');

    act(() => {
      setIconOverrides({});
    });

    expect(svg()?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('renders without a redux store, e.g. to a string', () => {
    expect(renderToString(<ThemeIcon name="mapMarker" />)).toContain('sg-icon-mapMarker-shadow');
  });

  it('renders nothing for an unknown name', () => {
    const { container } = render(<ThemeIcon name="unknown" />);

    expect(container.innerHTML).toBe('');
  });
});
