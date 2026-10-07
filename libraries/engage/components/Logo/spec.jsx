import { render, screen } from '@testing-library/react';
import Logo from './index';

jest.mock('./connector', () => Component => Component);

describe('<Logo />', () => {
  it('should render an image', () => {
    const { container } = render(<Logo />);

    const image = screen.getByRole('img', { name: 'Shopgate Connect' });

    expect(image).toHaveAttribute('src', 'https://example.com/logo');
    expect(container.querySelector('.engage__logo')).toContainElement(image);
  });
});
