import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ThemeContext } from '@shopgate/pwa-common/context';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import getCategory from '@shopgate/pwa-common-commerce/category/actions/getCategory';
import { Sheet as MockSheet } from '@shopgate/pwa-ui-shared';
import themeApi from '../../../../themeApi';
import { mockedState, categoriesById, emptyRootCategories } from '../../mockData';
import Picker from './index';
import styles from './style';

jest.unmock('@shopgate/pwa-common/context');
jest.unmock('@shopgate/pwa-ui-shared');

jest.mock('@shopgate/engage/components', () => ({
  ...jest.requireActual('@shopgate/engage/components'),
  SheetDrawer: props => <MockSheet {...props} />,
}));

jest.mock('@shopgate/pwa-common-commerce/category/actions/getCategory', () => jest.fn(() => () => { }));

/**
 * Renders the component.
 * @param {Object} props The component props.
 * @param {Object} [state=mockedState] A mocked Redux state.
 * @return {Object} The mounted component.
 */
const renderComponent = (props = {}, state = mockedState) => {
  const store = configureStore([thunk])(state);

  return mount(
    <Provider store={store}>
      <ThemeContext.Provider value={themeApi}>
        <Picker {...props} />
      </ThemeContext.Provider>
    </Provider>,
    mockRenderOptions
  );
};
describe('<NestedCategoryFilterPicker />', () => {
  const onSelect = jest.fn();

  const props = {
    onSelect,
    categoryId: '1',
    label: 'Picker Label',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the picker with no initial category selection', () => {
    const { label, selection } = styles;

    const wrapper = renderComponent(props);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${label}`).text()).toEqual(props.label);
    expect(wrapper.find(`div.${selection}`).text()).toEqual('common.please_choose');
    expect(wrapper.find('SheetDrawer').first().prop('isOpen')).toBe(false);
    expect(getCategory).not.toHaveBeenCalled();
  });

  it('should render the picker without a label', () => {
    const { label, selection } = styles;

    const wrapper = renderComponent({
      ...props,
      label: '',
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${label}`).exists()).toBe(false);
    expect(wrapper.find(`div.${selection}`).text()).toEqual('common.please_choose');
  });

  it('should handle user interaction as expected', () => {
    const wrapper = renderComponent(props);

    wrapper.find(Picker).simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SheetDrawer').first().prop('isOpen')).toBe(true);
    expect(wrapper.find('Drawer Header').prop('title')).toBe(props.label);

    const subcategoryList = wrapper.find('Drawer SheetItem');
    expect(subcategoryList).toHaveLength(2);
    expect(subcategoryList.children().at(0).text()).toEqual(categoriesById['1-1'].name);
    expect(subcategoryList.children().at(1).text()).toEqual(categoriesById['1-2'].name);

    subcategoryList.children().at(1).find('button').simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SheetDrawer').first().prop('isOpen')).toBe(false);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(props.categoryId, categoriesById['1-2']);
    expect(getCategory).not.toHaveBeenCalled();
  });

  it('should not accept user interaction when no categoryId was passed', () => {
    const { label, buttonDisabled } = styles;
    const wrapper = renderComponent({
      ...props,
      categoryId: undefined,
    });

    wrapper.find(Picker).simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`div.${label}`).parent().hasClass(buttonDisabled)).toBe(true);
    expect(wrapper.find('SheetDrawer').first().prop('isOpen')).toBe(false);
    expect(getCategory).not.toHaveBeenCalled();
  });

  it('should accept user interaction when the categoryId is an empty string', () => {
    const wrapper = renderComponent({
      ...props,
      categoryId: '',
    });

    wrapper.find(Picker).simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SheetDrawer').first().prop('isOpen')).toBe(true);
    expect(getCategory).not.toHaveBeenCalled();
  });

  it('should highlight the preselected subcategory within the sheet ', () => {
    const wrapper = renderComponent({
      ...props,
      selectedId: '1-1',
    });

    wrapper.find(Picker).simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Drawer SheetItem').first().prop('selected')).toBe(true);
    expect(getCategory).not.toHaveBeenCalled();
  });

  it('should request category data when it is not available yet', () => {
    const categoryId = '3';
    renderComponent({
      ...props,
      categoryId,
    });

    expect(getCategory).toHaveBeenCalledTimes(1);
    expect(getCategory).toHaveBeenCalledWith(categoryId);
  });

  it('should request root category data when it is not available yet', () => {
    const categoryId = '';
    renderComponent({
      ...props,
      categoryId,
    }, {
      category: {
        ...mockedState.category,
        rootCategories: emptyRootCategories,
      },
    });

    expect(getCategory).toHaveBeenCalledTimes(1);
    expect(getCategory).toHaveBeenCalledWith(categoryId);
  });
});
