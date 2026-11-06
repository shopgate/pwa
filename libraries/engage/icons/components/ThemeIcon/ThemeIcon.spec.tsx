import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { logger } from '@shopgate/engage/core/helpers';
import { setIconOverrides } from '../../helpers/overrides';
import ThemeIcon from './ThemeIcon';

jest.mock('@shopgate/engage/core/helpers', () => ({
  isDev: true,
  logger: { warn: jest.fn() },
}));

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

  it('warns once per unknown name', () => {
    (logger.warn as jest.Mock).mockClear();

    render(<ThemeIcon name="@shopgate/ext-foo/missing" />);
    render(<ThemeIcon name="@shopgate/ext-foo/missing" />);
    render(<ThemeIcon name="@shopgate/ext-foo/other" />);

    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('"@shopgate/ext-foo/missing"'));
  });

  it('doesn\'t warn for known names', () => {
    (logger.warn as jest.Mock).mockClear();

    render(<ThemeIcon name="cart" />);

    expect(logger.warn).not.toHaveBeenCalled();
  });
});
