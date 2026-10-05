/* eslint-disable react/prop-types */
import { render, screen, fireEvent } from '@testing-library/react';
import Item from './index';

jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }) => string },
  Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
}));

const label = 'Item Label';

describe('<Item />', () => {
  it('should render as a button when no href, but a click handler is passed to the props', () => {
    const clickHandler = jest.fn();
    render(<Item label={label} onClick={clickHandler} />);

    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveAttribute('href');

    fireEvent.click(button);

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should render as a link when an href is passed to the props', () => {
    const href = '/some/link';
    render(<Item label={label} href={href} />);

    expect(screen.getByRole('button', { name: label })).toHaveAttribute('href', href);
  });
});
/* eslint-enable react/prop-types */
