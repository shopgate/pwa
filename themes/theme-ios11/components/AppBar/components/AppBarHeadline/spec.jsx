import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppBarHeadline from './index';

jest.mock('@shopgate/engage/components', () => {
  const { forwardRef } = jest.requireActual('react');
  const Typography = forwardRef(({
    component: Component, children, variant, noWrap, fontWeight, ...props
  }, ref) => (
    <Component ref={ref} {...props}>{children}</Component>
  ));
  return {
    Typography,
    SurroundPortals: ({ children }) => children,
  };
});

describe('AppBarHeadline', () => {
  it('shows the title as the page heading', () => {
    render(<AppBarHeadline title="Jackets &amp; Coats" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Jackets & Coats');
    expect(heading).toHaveAttribute('aria-live', 'polite');
  });

  it('renders nothing without a title', () => {
    const { container } = render(<AppBarHeadline title="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('takes the focus silently after a tap', () => {
    document.dispatchEvent(new Event('pointerdown'));

    render(<AppBarHeadline title="Jackets" focus />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveFocus();
    expect(heading).toHaveAttribute('data-silent-focus');
  });

  it('leaves the focus alone without the focus prop', () => {
    render(<AppBarHeadline title="Jackets" />);

    expect(screen.getByRole('heading', { level: 1 })).not.toHaveFocus();
  });
});
