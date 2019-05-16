import React from 'react';
import { mount } from 'enzyme';
import { SheetList } from '@shopgate/engage/components';
import { Unwrapped as CategoryListWidget } from './index';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /**
   * Mocked LinkComponent
   * @return {JSX}
   */
  const Link = () => <div />;
  return Link;
});

describe('<CategoryListWidget />', () => {
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

    const wrapper = mount(<CategoryListWidget {...props} />);

    expect(wrapper.find(SheetList.Item).length).toBe(0);
    expect(wrapper).toMatchSnapshot();
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

    const wrapper = mount(<CategoryListWidget {...props} />);

    expect(wrapper.find(SheetList.Item).length).toBe(2);
    expect(wrapper).toMatchSnapshot();
  });
});
