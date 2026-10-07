import { render, screen } from '@testing-library/react';
import Content from './index';

describe('<Content />', () => {
  it('should not render if no content is passed', () => {
    const { container } = render(<Content />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render content components', () => {
    render(<Content content="Hello World" />);

    expect(screen.getByText('Hello World')).toHaveAttribute('id', 'basicDialogDesc');
  });
});
