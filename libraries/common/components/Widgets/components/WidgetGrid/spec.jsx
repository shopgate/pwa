import { render, screen } from '@testing-library/react';
import WidgetGrid from './index';

const Image = jest.fn(() => <div>Image widget</div>);

const components = {
  '@shopgate/commerce-widgets/image': Image,
};

describe('<WidgetGrid />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with a config', () => {
    const config = [{
      col: 0,
      row: 0,
      width: 12,
      height: 3,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: '@shopgate/commerce-widgets/image',
    }];

    const { container } = render((
      <WidgetGrid config={config} components={components} />
    ));

    const grid = container.firstChild;

    expect(container.childNodes).toHaveLength(1);
    expect(grid).toHaveClass('common__widgets__widget-grid');
    expect(grid.children).toHaveLength(1);
    expect(grid.firstChild).toHaveClass('common__widgets__widget');
    expect(grid.firstChild).toContainElement(screen.getByText('Image widget'));
    expect(Image.mock.lastCall[0]).toEqual({
      ratio: [12, 3],
      settings: config[0].settings,
    });
  });

  it('should not render without a `config` prop', () => {
    const { container } = render((
      <WidgetGrid components={components} />
    ));

    expect(container).toBeEmptyDOMElement();
    expect(Image).not.toHaveBeenCalled();
  });
});
