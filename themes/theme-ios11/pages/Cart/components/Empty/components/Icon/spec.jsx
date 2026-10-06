import { render } from '@testing-library/react';
import Icon from './index';

describe('<CartEmptyIcon />', () => {
  it('should render', () => {
    const { container } = render(<Icon />);

    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('viewBox', '0 0 208 208');
    expect(svg.querySelectorAll(':scope > circle')).toHaveLength(1);
    expect(svg.querySelectorAll(':scope > ellipse')).toHaveLength(1);
    expect(svg.querySelectorAll(':scope > g')).toHaveLength(2);
    expect(svg.querySelectorAll('g > path')).toHaveLength(8);
  });
});
