import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationAction from './NavigationAction';
import { registerNavigationAction } from '../registry';
import type { NavigationActionSettings, ResolvedNavigationAction } from '../types';

jest.mock('../actions', () => ({}));

const onClick = jest.fn();

registerNavigationAction('available', ({ link }) => ({
  available: true,
  icon: 'magnifier',
  label: `label:${link}`,
  onClick,
}));

registerNavigationAction('unavailable', () => ({
  available: false,
  icon: 'share',
  label: 'share',
  onClick,
}));

registerNavigationAction('counter', () => {
  const [count, setCount] = useState(0);
  return {
    available: true,
    icon: 'cart',
    label: 'cart',
    onClick: () => setCount(count + 1),
    badgeCount: count,
  };
});

const settings = (action: string, link = ''): NavigationActionSettings => ({
  action,
  icon: '',
  link,
});

const renderAction = (action: ResolvedNavigationAction) => (
  <button type="button" onClick={action.onClick}>
    {`${action.label}|${action.icon}|${action.badgeCount ?? ''}`}
  </button>
);

describe('<NavigationAction />', () => {
  it('renders an available action with its settings', () => {
    render(
      <NavigationAction settings={settings('available', '/page/a')}>
        {renderAction}
      </NavigationAction>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('label:/page/a|magnifier|');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders nothing for an unavailable action', () => {
    const { container } = render(
      <NavigationAction settings={settings('unavailable')}>
        {renderAction}
      </NavigationAction>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an action nobody registered', () => {
    const { container } = render(
      <NavigationAction settings={settings('categoryDrawer')}>
        {renderAction}
      </NavigationAction>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('remounts the action when the configured action changes', () => {
    const { rerender } = render(
      <NavigationAction settings={settings('counter')}>
        {renderAction}
      </NavigationAction>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('cart|cart|1');

    rerender(
      <NavigationAction settings={settings('available', '/x')}>
        {renderAction}
      </NavigationAction>
    );
    expect(screen.getByRole('button')).toHaveTextContent('label:/x|magnifier|');

    rerender(
      <NavigationAction settings={settings('counter')}>
        {renderAction}
      </NavigationAction>
    );
    expect(screen.getByRole('button')).toHaveTextContent('cart|cart|0');
  });
});
