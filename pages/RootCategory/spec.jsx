import React from 'react';
import { mount } from 'enzyme';
import { initialCategoryState, categoryState } from '@shopgate/pwa-common-commerce/category/mock';
import { UnwrappedRootCategory as RootCategory } from './index';

jest.mock('Components/List/components/Item', () => {
  /**
   * Renders a ListItem mock.
   * @return {JSX}
   */
  const ListItem = () => <div />;
  return ListItem;
});

jest.mock('Components/View');
let store;

const results = [
  [{
    type: 'NAVIGATE',
    params: {
      action: 'PUSH',
      pathname: '/category/6d656e',
      state: { title: 'Men' },
    },
  }],
];

/**
 * Creates component
 * @param {Object} props Component props.
 * @return {ReactWrapper}
 */
const createComponent = props => mount(<RootCategory {...props} />);

describe('<RootCategory> page', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render', () => {
    const categories = categoryState.category.categoriesById;
    const props = {
      open: true,
      categories: [categories.men, categories.women],
    };
    const component = createComponent(props);
    expect(component).toMatchSnapshot();
    expect(component.find('CategoryList').length).toEqual(1);
    expect(component.find('ListItem').length).toEqual(4);
  });

  it('should render empty', () => {
    const props = {
      open: true,
      categories: null,
    };
    const component = createComponent(props);
    expect(component).toMatchSnapshot();
    expect(component.find('CategoryList').length).toEqual(0);
    expect(component.find('ListItem').length).toEqual(0);
  });

  it.skip('should navigate to subcategory', () => {
    const wrapper = createComponent(categoryState);

    wrapper.find('CategoryList').find('Connect(Link)').at(0).simulate('click');
    wrapper.update();
    expect(store.getActions()).toEqual(results[0]);
  });
});
