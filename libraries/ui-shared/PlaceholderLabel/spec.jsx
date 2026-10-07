import { render, screen } from '@testing-library/react';
import PlaceholderLabel from './index';

describe('<PlaceholderLabel />', () => {
  it('should render placeholder ', () => {
    const { container } = render((
      <PlaceholderLabel ready={false}>
        <h1>foo</h1>
      </PlaceholderLabel>
    ));

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.ui-shared__placeholder-label')).toHaveLength(1);
  });

  it('should render children', () => {
    const { container } = render((
      <PlaceholderLabel ready>
        <h1>foo</h1>
      </PlaceholderLabel>
    ));

    expect(screen.getByRole('heading', { name: 'foo' })).toBeInTheDocument();
    expect(container.querySelector('.ui-shared__placeholder-label')).not.toBeInTheDocument();
  });
});
