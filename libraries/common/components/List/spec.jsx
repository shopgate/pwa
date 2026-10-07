import { render, screen } from '@testing-library/react';
import List from './index';

describe('<List />', () => {
  const children = [
    <List.Item key="0">Item 0</List.Item>,
    <List.Item key="1">Item 1</List.Item>,
    <List.Item key="2">Item 2</List.Item>,
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with children', () => {
    const numChildren = children.length;
    render(<List>{children}</List>);

    expect(screen.getByRole('list')).toHaveClass('common_list');
    expect(screen.getAllByRole('listitem')).toHaveLength(numChildren);
  });

  it('renders without children', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<List />);

    expect(screen.getByRole('list')).toHaveClass('common_list');
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
