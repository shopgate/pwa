import { render, screen, act } from '@testing-library/react';
import { ThemeResourcesProvider } from '@shopgate/engage/core/providers';
import Widgets from './index';

jest.useFakeTimers();

jest.mock('@shopgate/pwa-common/context', () => ({
  ThemeContext: {
    Provider: ({ children }) => children,
  },
}));

const Image = jest.fn(() => <img alt="Widget" />);

const components = {
  v1: {
    '@shopgate/commerce-widgets/image': Image,
  },
};

/**
 * @param {Object[]} widgets Widgets to be rendered.
 * @returns {JSX.Element}
 */
const createWrapper = widgets => render((
  <ThemeResourcesProvider widgets={components} components={{}}>
    <Widgets
      widgets={widgets}
    />
  </ThemeResourcesProvider>
));

/**
 * @param {HTMLElement} container The container of the rendered widgets.
 * @returns {HTMLElement|null} The widget grid.
 */
const getWidgetGrid = container => container.querySelector('.common__widgets__widget-grid');

describe('<Widgets />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a grid if height is defined', () => {
    const widgets = [{
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

    const { container } = createWrapper(widgets);

    expect(getWidgetGrid(container)).toBeInTheDocument();
    expect(getWidgetGrid(container)).toContainElement(screen.getByRole('img'));
  });

  it('should not wrap a widget which is not a grid and has no height', () => {
    const widgets = [{
      col: 0,
      row: 0,
      width: 12,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: '@shopgate/commerce-widgets/image',
    }];

    const { container } = createWrapper(widgets);

    expect(container.innerHTML).toBe('<div class="common__widgets"><img alt="Widget"></div>');
    expect(Image.mock.lastCall[0]).toEqual(widgets[0]);
    expect(getWidgetGrid(container)).not.toBeInTheDocument();
  });

  it('should render a grid if the widget is of type grid', () => {
    const widgets = [{
      type: '@shopgate/commerce-widgets/widget-grid',
      settings: {
        widgets: [
          {
            col: 0,
            row: 0,
            width: 12,
            height: 5,
            settings: {
              id: '84961',
              alt: '',
              image: 'https://data.shopgate.com/shop_widget_images/23836/aedc545959f55e3f73851eca0ed40a75.min.jpeg',
              link: '/category/',
            },
            type: '@shopgate/commerce-widgets/image',
          },
        ],
      },
    }];

    const { container } = createWrapper(widgets);

    const grid = getWidgetGrid(container);

    expect(grid).toBeInTheDocument();
    expect(grid.parentElement).toHaveClass('common__widgets');
    expect(grid.children).toHaveLength(1);
    expect(grid.firstChild).toHaveClass('common__widgets__widget');
    expect(grid.firstChild).toContainElement(screen.getByRole('img'));
    expect(Image.mock.lastCall[0]).toEqual({
      ratio: [12, 5],
      settings: widgets[0].settings.widgets[0].settings,
    });
  });

  it('should render only one widget when the second one is not published and third one is invalid', () => {
    const widgets = [
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835351,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/image',
      },
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835352,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/imagefoo',
      },
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          published: false,
          id: 835353,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/image',
      },
    ];

    const { container } = createWrapper(widgets);

    expect(container.innerHTML).toBe('<div class="common__widgets"><img alt="Widget"></div>');
    expect(Image.mock.lastCall[0]).toEqual(widgets[0]);
  });

  it('should schedule a re-render when widget is scheduled', () => {
    const base = new Date('2023-01-01T10:37:00.000Z');
    jest.setSystemTime(base);

    const minutesToNextFullHour = 60 - base.getMinutes();
    const msToNextFullHour = minutesToNextFullHour * 60000;

    const scheduledFromMs = (Date.now() + msToNextFullHour) - 1;
    const scheduledToMs = Date.now() + msToNextFullHour + 1000;

    const widgets = [
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835351,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
          published: true,
          plan: true,
          planDate: {
            valid_from: new Date(scheduledFromMs).toISOString(),
            valid_to: new Date(scheduledToMs).toISOString(),
          },
        },
        type: '@shopgate/commerce-widgets/image',
      },
    ];

    const { unmount } = createWrapper(widgets);
    const clearSpy = jest.spyOn(global, 'clearTimeout');

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(msToNextFullHour);
    });
    expect(screen.getByRole('img')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(60 * 60000);
    });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    unmount();
    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
  });

  it('should render only wrapper when widgets array is empty', () => {
    const widgets = [];
    const { container } = createWrapper(widgets);
    expect(container.innerHTML).toBe('<div class="common__widgets"></div>');
    expect(Image).not.toHaveBeenCalled();
  });

  it('should render null when no widgets are passed', () => {
    const { container } = createWrapper(undefined);
    expect(container).toBeEmptyDOMElement();
  });

  it('should check settings of child widgets inside widget-grid', () => {
    const widgets = [
      {
        height: 2,
        id: 'index-5-@shopgate/commerce-widgets/widget-grid',
        type: '@shopgate/commerce-widgets/widget-grid',
        settings: {
          widgets: [
            {
              col: 0,
              row: 0,
              height: 2,
              width: 2,
              settings: {
                id: 835351,
                image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
                published: true,
                plan: false,
              },
              type: '@shopgate/commerce-widgets/image',
            },
            {
              col: 2,
              row: 0,
              height: 2,
              width: 2,
              settings: {
                id: 835352,
                image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
                published: false,
                plan: false,
              },
              type: '@shopgate/commerce-widgets/image',
            },
          ],
        },
      },
    ];
    createWrapper(widgets);
    expect(screen.getAllByRole('img').length).toBe(1);
  });
});
