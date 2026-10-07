import { render } from '@testing-library/react';
import GridItem from './index';

describe('<GridItem />', () => {
  it('should render without any further props', () => {
    const { container } = render(<GridItem />);

    expect(container.firstChild.tagName).toBe('LI');
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should be able to render a custom tag', () => {
    const { container } = render(<GridItem component="section" />);

    expect(container.firstChild.tagName).toBe('SECTION');
  });

  it('should add custom classes on demand', () => {
    const { container } = render(<GridItem className="custom-class-name" />);

    expect(container.firstChild.tagName).toBe('LI');
    expect(container.firstChild).toHaveClass('custom-class-name');
  });
});
