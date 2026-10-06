import { render, screen } from '@testing-library/react';
import SheetList from './index';

describe('<SheetList />', () => {
  it('should render with two children', () => {
    render((
      <SheetList>
        <SheetList.Item title="List Item" />
        <SheetList.Item title="List Item" />
      </SheetList>
    ));

    expect(screen.getByRole('listbox')).toHaveClass('engage__sheet-list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByText('List Item')).toHaveLength(2);
  });

  it('should render a child and add styles for list items with images', () => {
    render((
      <SheetList hasImages>
        <SheetList.Item title="List Item" />
      </SheetList>
    ));

    const item = screen.getByRole('listitem');

    expect(screen.getAllByText('List Item')).toHaveLength(1);
    expect(item).toHaveClass('engage__sheet-list__item');
    expect(item.className).toContain('itemWithImage');
  });

  it('should not render without children', () => {
    const { container } = render((
      <SheetList />
    ));

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render invalid children', () => {
    render((
      <SheetList>
        <SheetList.Item title="List Item" />
        xxx
      </SheetList>
    ));

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getAllByText('List Item')).toHaveLength(1);
    expect(screen.queryByText('xxx')).not.toBeInTheDocument();
  });
});
