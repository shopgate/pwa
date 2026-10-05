import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './index';

describe('<SearchBar />', () => {
  it('should call handleChange on input', () => {
    const handleChange = jest.fn();
    const { container } = render(<SearchBar handleChange={handleChange} />);

    const input = screen.getByRole('searchbox');

    expect(container.querySelector('[data-test-id="SearchField"]'))
      .toHaveClass('ui-shared__sheet__search-field');
    expect(input).toHaveAttribute('name', 'search');
    expect(input).toHaveValue('');
    expect(screen.getByText('search.placeholder')).toBeInTheDocument();

    fireEvent.change(input, {
      target: {
        name: 'search',
        value: 'asdf',
      },
    });

    expect(handleChange).toHaveBeenCalledWith('asdf');
    expect(input).toHaveValue('asdf');
    expect(screen.queryByText('search.placeholder')).not.toBeInTheDocument();
  });
});
