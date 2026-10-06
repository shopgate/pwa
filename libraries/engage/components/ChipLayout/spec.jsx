import { render, screen } from '@testing-library/react';
import Chip from '@shopgate/pwa-ui-shared/Chip';
import ChipsLayout from './index';

describe('<ChipsLayout />', () => {
  it('should render with one chip', () => {
    const { container } = render((
      <ChipsLayout>
        <Chip id="some-id">foo</Chip>
      </ChipsLayout>
    ));

    expect(container.querySelector('.engage__chip-layout')).toBeInTheDocument();
    expect(container.querySelectorAll('.ui-shared__chip')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'foo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'more' })).toBeInTheDocument();
  });

  it('should render with two chips', () => {
    const { container } = render((
      <ChipsLayout>
        <Chip id="some-id">foo</Chip>
        <Chip id="some-other-id">bar</Chip>
      </ChipsLayout>
    ));

    const chips = container.querySelectorAll('.ui-shared__chip');

    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent('foo');
    expect(chips[1]).toHaveTextContent('bar');
    expect(screen.getByRole('button', { name: 'more' })).toBeInTheDocument();
  });
});
