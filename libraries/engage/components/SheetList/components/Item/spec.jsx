import { render, screen, fireEvent } from '@testing-library/react';
import Item from './index';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /**
   * Mocked LinkComponent.
   * @return {JSX}
   */
  // eslint-disable-next-line react/prop-types
  const Link = ({ href, children }) => <a href={href}>{children}</a>;
  return Link;
});

describe('<SheetList.Item />', () => {
  const title = 'My Title';

  it('should render with a title but no image', () => {
    render(<Item title={title} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render with an image', () => {
    const image = <img src="url/to/image" alt="Alternative text" />;

    render(<Item title={title} image={image} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alternative text' })).toHaveAttribute('src', 'url/to/image');
  });

  it('should render with a right component', () => {
    const rightComponent = <span>I`m a span.</span>;

    render(<Item
      title={title}
      rightComponent={rightComponent}
    />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText('I`m a span.')).toBeInTheDocument();
  });

  it('should mark the item as selected', () => {
    const { container } = render(<Item title={title} isSelected />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(container.querySelector('.common__grid').className).toContain('selected');
    expect(container.querySelector('.ui-shared__glow')).not.toBeInTheDocument();
  });

  it('should render without a Glow when disabled', () => {
    const { container } = render(<Item title={title} isDisabled />);

    expect(screen.getByText(title).parentElement.className).toContain('disabled');
    expect(container.querySelector('.ui-shared__glow')).not.toBeInTheDocument();
  });

  it('should render with a link', () => {
    const { container } = render(<Item title={title} link="url/to/somewhere" />);

    const link = screen.getByRole('link', { name: title });

    expect(link).toHaveAttribute('href', 'url/to/somewhere');
    expect(container.querySelector('.ui-shared__glow')).toContainElement(link);
  });

  it('should render with an onClick element', () => {
    const spy = jest.fn();

    const { container } = render(<Item title={title} onClick={spy} />);

    const option = screen.getByRole('option', { name: title });

    fireEvent.click(option);

    expect(option).toHaveAttribute('aria-selected', 'false');
    expect(option).toContainElement(container.querySelector('.ui-shared__glow'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should update the disabled state when isDisabled changes', () => {
    const { rerender } = render(<Item title={title} isDisabled />);
    expect(screen.getByText(title).parentElement.className).toContain('disabled');
    rerender(<Item title={title} isDisabled={false} />);
    expect(screen.getByText(title).parentElement.className).not.toContain('disabled');
  });
});
