import { render, screen } from '@testing-library/react';
import ProductName from './ProductName';

/**
 * Returns the element that clamps the product name.
 * @returns The clamping element.
 */
const getClampElement = () => screen
  .getByLabelText('Product name.')
  .querySelector<HTMLElement>('.common__ellipsis');

describe('<ProductName />', () => {
  it('should render the product name', () => {
    render(<ProductName name="Product name" />);

    expect(screen.getByLabelText('Product name.')).toHaveTextContent('Product name');
  });

  it('should not clamp the name when ellipsis is disabled', () => {
    render(<ProductName name="Product name" ellipsis={false} />);

    expect(getClampElement()).toBeNull();
  });
});
