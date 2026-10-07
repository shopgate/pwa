import { render, screen } from '@testing-library/react';
import Ellipsis from './index';

const clamp = 3;
const text = 'Some very long text that should be cut off by this ellipsis component.';

describe('<Ellipsis />', () => {
  it('should render', () => {
    render(<Ellipsis rows={clamp}>{text}</Ellipsis>);

    const ellipsis = screen.getByText(text);

    expect(ellipsis.tagName).toBe('DIV');
    expect(ellipsis).toHaveClass('common__ellipsis');
    expect(ellipsis.getAttribute('style')).toContain('line-clamp: 3');
  });
});
