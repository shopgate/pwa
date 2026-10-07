import { render, screen } from '@testing-library/react';
import Chip from '.';

describe('<Chip />', () => {
  it('should render a tag', () => {
    const { container } = render(<Chip id="some-id">text</Chip>);

    const buttons = screen.getAllByRole('button');

    expect(container.querySelector('[data-test-id="some-id"]')).toHaveClass('ui-shared__chip');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('data-test-id', 'removeFilter');
    expect(buttons[1]).toHaveTextContent('text');
  });
});

describe('<Chip />', () => {
  it('should render a without removable icon', () => {
    const { container } = render(<Chip id="some-id" removable={false}>text</Chip>);

    const buttons = screen.getAllByRole('button');

    expect(container.querySelector('[data-test-id="some-id"]')).toHaveClass('ui-shared__chip');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('text');
    expect(container.querySelector('[data-test-id="removeFilter"]')).not.toBeInTheDocument();
  });
});
