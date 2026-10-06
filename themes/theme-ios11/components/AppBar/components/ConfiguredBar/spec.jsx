import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfiguredBar from './index';

let mockScroll = {
  scrolled: false,
  scrollingDown: false,
};

jest.mock('@shopgate/pwa-ui-ios', () => {
  /* eslint-disable react/prop-types */
  const AppBar = ({
    left, center, right, backgroundColor, classes,
  }) => (
    <section data-testid="bar" data-background={backgroundColor} className={classes.outer}>
      <div data-testid="left">{left}</div>
      <div data-testid="center">{center}</div>
      <div data-testid="right">{right}</div>
    </section>
  );
  AppBar.Title = ({ title }) => <span>{`title:${title}`}</span>;
  /* eslint-enable react/prop-types */
  return { AppBar };
});
jest.mock('@shopgate/engage/components', () => ({
  Logo: () => <span>logo</span>,
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

  it('floats transparently over the content and marks the header', () => {
    renderBar({
      modern: true,
      overlay: true,
      logo: true,
    });

    expect(screen.getByTestId('bar')).toHaveAttribute('data-background', 'transparent');
    expect(document.getElementById('AppHeader')).toHaveAttribute('data-overlay', 'true');
  });

  it('fills the status bar area while the buttons float over scrolled content', () => {
    mockScroll = {
      scrolled: true,
      scrollingDown: false,
    };
    renderBar({
      modern: true,
      overlay: true,
      settings: { modern: { scrollBehavior: 'floatingButtons' } },
    });

    expect(screen.getByTestId('bar').className).toMatch(/statusFilled/);
    expect(screen.getByTestId('bar').className).toMatch(/logoHidden/);
  });

  it('falls back to the centered logo for an unknown position', () => {
    renderBar({
      logo: true,
      settings: { logoPosition: 'start' },
    });

    expect(within(screen.getByTestId('center')).getByText('logo')).toBeInTheDocument();
  });

  it('switches from floating buttons to the bar once the page is scrolled', () => {
    const { rerender } = renderBar({
      modern: true,
      overlay: true,
    });
    const floatingClass = screen.getByTestId('bar').className;

    mockScroll = {
      scrolled: true,
      scrollingDown: true,
    };
    rerender(
      <ConfiguredBar settings={createSettings()} modern overlay showActions />
    );

    expect(screen.getByTestId('bar').className).not.toEqual(floatingClass);
    expect(screen.getByTestId('bar')).toHaveClass('theme__app-bar--revealed');
  });

  it('slides the bar out while scrolling down with scrollAway', () => {
    mockScroll = {
      scrolled: true,
      scrollingDown: true,
    };
    renderBar({
      modern: true,
      overlay: true,
      settings: { modern: { scrollBehavior: 'scrollAway' } },
    });

    expect(screen.getByTestId('bar')).toHaveClass('theme__app-bar--hidden');
  });
});
