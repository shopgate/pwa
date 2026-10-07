import { render } from '@testing-library/react';
import Grid from './index';

describe('<Grid />', () => {
  it('should render without any further props', () => {
    const { container } = render(<Grid />);

    expect(container.firstChild.tagName).toBe('UL');
    expect(container.firstChild).toHaveClass('common__grid');
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should be able to render a custom tag', () => {
    const { container } = render(<Grid component="article" />);

    expect(container.firstChild.tagName).toBe('ARTICLE');
    expect(container.firstChild).toHaveClass('common__grid');
  });

  it('should add custom classes on demand', () => {
    const { container } = render(<Grid className="custom-class-name" />);

    expect(container.firstChild.tagName).toBe('UL');
    expect(container.firstChild).toHaveClass('common__grid', 'custom-class-name');
  });
});
