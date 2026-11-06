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

  it('keeps the line widths of the markup by default', () => {
    const { container } = render(<Icon content='<path stroke="#000" stroke-width="1" d="M0"/><path stroke="#000" stroke-width="2" d="M1"/>' />);

    expect(Array.from(container.querySelectorAll('path')).map(path => path.getAttribute('stroke-width')))
      .toEqual(['1', '2']);
  });

  it('removes the line widths of the markup when colors are replaced', () => {
    const { container } = render(<Icon content='<path stroke="#000" stroke-width="2" d="M0"/>' keepColors={false} />);

    expect(container.querySelector('path')?.hasAttribute('stroke-width')).toBe(false);
  });
});
