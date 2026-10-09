import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguredBar from './index';

let mockScroll = {
  moved: false,
  scrolled: false,
  scrollingDown: false,
};

jest.mock('@shopgate/engage/components', () => {
  /* eslint-disable react/prop-types */
  const AppBar = ({
    left, center, right, classes, inert, below, leftEnd, rightStart, ...props
  }) => (
    <section data-testid="bar" data-inert={inert ? true : undefined} {...props}>
      <div data-testid="left">
        {left}
        {leftEnd}
      </div>
      <div data-testid="center">{center}</div>
      <div data-testid="right">
        {rightStart}
        {right}
      </div>
    </section>
  );
  /* eslint-enable react/prop-types */
  return {
    AppBarIOS: AppBar,
    Logo: () => <span>logo</span>,
    SurroundPortals: ({ children }) => children,
  };
});
jest.mock('../ActionButton', () => {
  // eslint-disable-next-line react/prop-types
  const ActionButton = ({ settings }) => <span>{`action:${settings.action}`}</span>;
  return ActionButton;
});
jest.mock('../../constants', () => ({
  APP_BAR_BUTTON_SIZE: 44,
  FLOATING_BUTTON_INSET: 4,
  SEARCH_BAR_FLOATING_HEIGHT_VAR: '--sg-search-bar-floating-height',
}));
jest.mock('../../hooks', () => ({
  useOverlayScroll: () => mockScroll,
}));

const slot = action => ({
  action,
  icon: '',
  link: '',
});

const createSettings = (overrides = {}) => ({
  variant: 'fixed',
  showLogo: true,
  logoPosition: 'center',
  floating: { scrollBehavior: 'revealBar' },
  buttons: {
    left1: slot('openSearch'),
    left2: slot('none'),
    right1: slot('share'),
    right2: slot('favorites'),
  },
  ...overrides,
});

const renderBar = ({ settings, ...props } = {}) => render(
  <ConfiguredBar
    settings={createSettings(settings)}
    floating={false}
    overlay={false}
    showActions
    {...props}
  />
);

const texts = testId => Array.from(screen.getByTestId(testId).querySelectorAll('span'))
  .map(element => element.textContent);

describe('<ConfiguredBar />', () => {
  beforeEach(() => {
    mockScroll = {
      moved: false,
      scrolled: false,
      scrollingDown: false,
    };
    document.body.innerHTML = '<header id="AppHeader"></header>';
  });

  it('places the configured buttons next to the system buttons', () => {
    renderBar({
      left: <span>back</span>,
      right: <span>cart</span>,
      title: 'Jackets',
    });

    expect(texts('left')).toEqual(['back', 'action:openSearch']);
    expect(texts('right')).toEqual(['action:share', 'action:favorites', 'cart']);
    expect(texts('center')).toEqual([]);
  });

  it('leaves the configured buttons out where the page hides them', () => {
    renderBar({ showActions: false });

    expect(texts('left')).toEqual([]);
    expect(texts('right')).toEqual([]);
  });

  it.each([
    ['left', 'left'],
    ['center', 'center'],
    ['right', 'right'],
  ])('puts the logo %s', (logoPosition, testId) => {
    renderBar({
      logo: true,
      settings: { logoPosition },
    });

    expect(within(screen.getByTestId(testId)).getByText('logo')).toBeInTheDocument();
  });

  it('leaves the logo out when it is switched off', () => {
    renderBar({
      logo: true,
      title: 'Home',
      settings: { showLogo: false },
    });

    expect(screen.queryByText('logo')).not.toBeInTheDocument();
    expect(texts('center')).toEqual([]);
  });

  it.each([false, true])('keeps the title out of the bar (floating: %s)', (floating) => {
    renderBar({
      floating,
      title: 'Jackets',
    });

    expect(texts('center')).toEqual([]);
  });

  it('keeps an explicit center of a page in the bar', () => {
    renderBar({
      floating: true,
      center: <span>custom</span>,
    });

    expect(texts('center')).toEqual(['custom']);
  });

  it('floats over the content and marks the header', () => {
    renderBar({
      floating: true,
      overlay: true,
      logo: true,
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-overlay');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-variant', 'floating');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-logo-position', 'center');
    expect(document.getElementById('AppHeader')).toHaveAttribute('data-overlay');
  });

  it('removes the mark of the header when the bar no longer floats', () => {
    const { unmount } = renderBar({
      floating: true,
      overlay: true,
    });
    unmount();

    expect(document.getElementById('AppHeader')).not.toHaveAttribute('data-overlay');
  });

  it('hides the logo while the buttons float over scrolled content', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: false,
    };
    renderBar({
      floating: true,
      overlay: true,
      settings: { floating: { scrollBehavior: 'floatingButtons' } },
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-logo-hidden');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-revealed');
  });

  it('reveals the bar as soon as content moves below it', () => {
    renderBar({
      floating: true,
      overlay: true,
    });
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-revealed');

    mockScroll = {
      moved: true,
      scrolled: false,
      scrollingDown: false,
    };
    renderBar({
      floating: true,
      overlay: true,
    });

    expect(screen.getAllByTestId('bar')[1]).toHaveAttribute('data-revealed');
  });

  it('returns as floating header when scrolling up with scrollAway', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: false,
    };
    renderBar({
      floating: true,
      overlay: true,
      settings: { floating: { scrollBehavior: 'scrollAway' } },
    });

    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-revealed');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-hidden');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-inert');
  });

  it('slides the bar out of reach while scrolling down with scrollAway', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: true,
    };
    renderBar({
      floating: true,
      overlay: true,
      settings: { floating: { scrollBehavior: 'scrollAway' } },
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-hidden');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-inert');
    expect(screen.getByTestId('bar')).toHaveAttribute('aria-hidden', 'true');
  });
});
