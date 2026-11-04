import { render } from '@testing-library/react';
import Icon from '.';

describe('common > components > Icon', () => {
  it('keeps the colors of the markup by default', () => {
    const { container } = render(<Icon content='<path fill="#e30000" d="M0"/>' />);

    expect(container.querySelector('path')?.getAttribute('fill')).toBe('#e30000');
  });

  it('replaces the colors of the markup when asked to', () => {
    const { container } = render(<Icon content='<path fill="#e30000" d="M0"/>' keepColors={false} />);

    expect(container.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
  });
});
