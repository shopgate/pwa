import { render, screen } from '@testing-library/react';
import Title from './index';

describe('<Title />', () => {
  it('should not render without a title', () => {
    const { container } = render(<Title />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render with a title', () => {
    render(<Title title="Some test title" />);

    const heading = screen.getByRole('heading', {
      name: 'Some test title',
      level: 2,
    });

    expect(heading).toHaveAttribute('id', 'basicDialogTitle');
  });
});
