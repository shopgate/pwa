import { render, screen } from '@testing-library/react';
import PlaceholderParagraph from './index';

describe('<PlaceholderParagraph />', () => {
  it('should render placeholder ', () => {
    const { container } = render((
      <PlaceholderParagraph ready={false}>
        <h1>foo</h1>
      </PlaceholderParagraph>
    ));

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    const labels = container.querySelectorAll('.ui-shared__placeholder-paragraph > .ui-shared__placeholder-label');

    expect(labels).toHaveLength(3);
    expect(labels[0]).toHaveStyle({ width: '95%' });
    expect(labels[1]).not.toHaveAttribute('style');
    expect(labels[2]).toHaveStyle({ width: '100%' });
  });

  it('should render children', () => {
    const { container } = render((
      <PlaceholderParagraph ready>
        <h1>foo</h1>
      </PlaceholderParagraph>
    ));

    expect(screen.getByRole('heading', { name: 'foo' })).toBeInTheDocument();
    expect(container.querySelector('.ui-shared__placeholder-label')).not.toBeInTheDocument();
  });
});
