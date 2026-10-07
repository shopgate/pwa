import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguredBar from './index';

let mockScroll = {
  moved: false,
  scrolled: false,
  scrollingDown: false,
};

jest.mock('@shopgate/pwa-ui-ios', () => {
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
  AppBar.Title = ({ title }) => <span>{`title:${title}`}</span>;
  /* eslint-enable react/prop-types */
  return { AppBar };
});
jest.mock('@shopgate/engage/components', () => ({
  Logo: () => <span>logo</span>,
  SurroundPortals: ({ children }) => children,
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: { text: input => input },
}));
jest.mock('../ActionButton', () => {
  // eslint-disable-next-line react/prop-types
  const ActionButton = ({ settings }) => <span>{`action:${settings.action}`}</span>;
  return ActionButton;
});
jest.mock('../../constants', () => ({
  APP_BAR_BUTTON_SIZE: 44,
  FLOATING_BUTTON_INSET: 4,
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
  style: 'classic',
  showLogo: true,
  logoPosition: 'center',
  modern: { scrollBehavior: 'revealBar' },
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
    modern={false}
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
    expect(texts('center')).toEqual(['title:Jackets']);
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

  it('keeps the title out of the modern bar', () => {
    renderBar({
      modern: true,
      title: 'Jackets',
    });

    expect(texts('center')).toEqual([]);
  });

  it('keeps an explicit center of a page in the modern bar', () => {
    renderBar({
      modern: true,
      center: <span>custom</span>,
    });

    expect(texts('center')).toEqual(['custom']);
  });

  it('floats over the content and marks the header', () => {
    renderBar({
      modern: true,
      overlay: true,
      logo: true,
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-overlay');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-style', 'modern');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-logo-position', 'center');
    expect(document.getElementById('AppHeader')).toHaveAttribute('data-overlay');
  });

  it('removes the mark of the header when the bar no longer floats', () => {
    const { unmount } = renderBar({
      modern: true,
      overlay: true,
    });
    unmount();

    expect(document.getElementById('AppHeader')).not.toHaveAttribute('data-overlay');
  });

  it('fills the status bar area while the buttons float over scrolled content', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: false,
    };
    renderBar({
      modern: true,
      overlay: true,
      settings: { modern: { scrollBehavior: 'floatingButtons' } },
    });

    expect(document.querySelector('.theme__app-bar__status-fill')).toHaveAttribute('data-filled');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-logo-hidden');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-revealed');
  });

  it('reveals the bar as soon as content moves below it', () => {
    renderBar({
      modern: true,
      overlay: true,
    });
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-revealed');

    mockScroll = {
      moved: true,
      scrolled: false,
      scrollingDown: false,
    };
    renderBar({
      modern: true,
      overlay: true,
    });

    expect(screen.getAllByTestId('bar')[1]).toHaveAttribute('data-revealed');
  });

  it('shows the bar again when scrolling up with scrollAway', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: false,
    };
    renderBar({
      modern: true,
      overlay: true,
      settings: { modern: { scrollBehavior: 'scrollAway' } },
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-revealed');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-hidden');
    expect(screen.getByTestId('bar')).not.toHaveAttribute('data-inert');
    expect(document.querySelector('.theme__app-bar__status-fill')).not.toHaveAttribute('data-filled');
  });

  it('slides the bar out of reach while scrolling down with scrollAway', () => {
    mockScroll = {
      moved: true,
      scrolled: true,
      scrollingDown: true,
    };
    renderBar({
      modern: true,
      overlay: true,
      settings: { modern: { scrollBehavior: 'scrollAway' } },
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-hidden');
    expect(screen.getByTestId('bar')).toHaveAttribute('data-inert');
    expect(screen.getByTestId('bar')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.theme__app-bar__status-fill')).toHaveAttribute('data-filled');
  });
});
