import { render, screen } from '@testing-library/react';
import { SheetList } from '@shopgate/engage/components';
import { Unwrapped as CategoryListWidget } from './index';

jest.mock('@shopgate/engage/components');

describe('<CategoryListWidget />', () => {
  let itemSpy;

  beforeEach(() => {
    itemSpy = jest.spyOn(SheetList, 'Item');
  });

  afterEach(() => {
    itemSpy.mockRestore();
  });

  it('should not render the CategoryListWidget', () => {
    const props = {
      fetchCategory: () => {},
      items: null,
      settings: {
        categoryNumber: '',
        headline: 'Yay Categories',
        showImages: false,
      },
    };

    const { container } = render(<CategoryListWidget {...props} />);

    expect(itemSpy).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });

  it('should render the CategoryListWidget', () => {
    const props = {
      fetchCategory: () => {},
      items: [
        {
          id: '1',
          name: 'Headline',
          imageUrl: '/some/url',
        },
        {
          id: '2',
          name: 'Headline',
          imageUrl: '/some/url',
        },
      ],
      settings: {
        categoryNumber: '',
        headline: 'Yay Categories',
        showImages: false,
      },
    };

    render(<CategoryListWidget {...props} />);

    expect(screen.getByRole('heading', {
      level: 2,
      name: 'Yay Categories',
    })).toBeInTheDocument();
    expect(itemSpy.mock.calls[0][0]).toEqual({
      image: null,
      link: '/category/31',
      title: 'Headline',
      testId: 'Headline',
    });
    expect(itemSpy.mock.calls[1][0]).toEqual({
      image: null,
      link: '/category/32',
      title: 'Headline',
      testId: 'Headline',
    });
  });
});
