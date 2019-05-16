/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ThemeContext } from '@shopgate/pwa-common/context';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { Sheet as MockSheet } from '@shopgate/pwa-ui-shared';
import themeApi from '../../themeApi';
import { mockedState } from './mockData';
import Picker from './components/Picker';
import { UnwrappedNestedCategoryFilter as Widget } from './index';

jest.unmock('@shopgate/pwa-common/context');
jest.unmock('@shopgate/pwa-ui-shared');

jest.mock('@shopgate/engage/components', () => ({
  ...jest.requireActual('@shopgate/engage/components'),
  SheetDrawer: props => <MockSheet {...props} />,
}));

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
        <Widget {...props} />
      </ThemeContext.Provider>
    </Provider>,
    mockRenderOptions
  );
};

const id = 'widget-id';
const settings = {
  categoryNumber: '',
  limit: '4',
  headline: 'Widget Headline',
  label_1: 'Label One',
  label_2: 'Label Two',
  label_3: '',
  label_4: '',
};

const props = {
  id,
  settings,
};

/**
 * @param {Object} wrapper The rendered widget.
 * @param {Array} expectedProps A list of expected props for the pickers.
 * @param {string} [buttonCategoryId=null] A categoryId for the button link.
 */
const checkWrapper = (wrapper, expectedProps, buttonCategoryId = null) => {
  const pickers = wrapper.find('Connect(CategoryPicker)');
  pickers.forEach((picker, index) => {
    expect(picker.props()).toEqual({
      ...expectedProps[index],
      label: settings[`label_${index + 1}`],
      onSelect: expect.any(Function),
    });
  });

  const button = wrapper.find('Connect(ButtonLink)');
  expect(button.prop('href')).toBe(`${CATEGORY_PATH}/${bin2hex(buttonCategoryId)}`);
  expect(button.prop('disabled')).toBe(!buttonCategoryId);
  expect(button.text()).toBe('common.show_products');
};

describe('<NestedCategoryFilterWidget />', () => {
  it('should render the widget with a persisted state and handle user interaction as expected', () => {
    expect.assertions(23);
    const persistedState = {
      pickers: [
        { categoryId: '', selectedId: '1' },
        { categoryId: '1', selectedId: '1-2' },
        { categoryId: '1-2', selectedId: '1-2-1' },
      ],
      buttonCategoryId: '1-2-1',
    };

    const wrapper = renderComponent({
      ...props,
      persistedState,
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').prop('text')).toBe(settings.headline);
    expect(wrapper.find('Headline').isEmptyRender()).toBe(false);

    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(3);
    checkWrapper(wrapper, [
      { categoryId: '', selectedId: '1' },
      { categoryId: '1', selectedId: '1-2' },
      { categoryId: '1-2', selectedId: '1-2-1' },
    ], '1-2-1');

    wrapper.find(Picker).at(0).simulate('click');
    wrapper.find(Picker).at(0).find('List button').at(0)
      .simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(2);
    checkWrapper(wrapper, [
      { categoryId: '', selectedId: '1' },
      { categoryId: '1', selectedId: null },
    ]);

    wrapper.find(Picker).at(1).simulate('click');
    wrapper.find(Picker).at(1).find('List button').at(0)
      .simulate('click');

    expect(wrapper).toMatchSnapshot();
    checkWrapper(wrapper, [
      { categoryId: '', selectedId: '1' },
      { categoryId: '1', selectedId: '1-1' },
    ], '1-1');
  });

  it('should render the widget without a headline and persisted state', () => {
    expect.assertions(14);
    const wrapper = renderComponent({
      ...props,
      settings: {
        ...props.settings,
        headline: '',
        limit: '3',
      },
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Headline').prop('text')).toBe('');
    expect(wrapper.find('Headline').isEmptyRender()).toBe(true);

    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(1);
    checkWrapper(wrapper, [
      { categoryId: '', selectedId: null },
    ]);

    wrapper.find(Picker).at(0).simulate('click');
    wrapper.find(Picker).at(0).find('List button').at(1)
      .simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(1);
    checkWrapper(wrapper, [
      { categoryId: '', selectedId: '2' },
    ], '2');
  });

  it('should render the widget for a category which is not the root category', () => {
    expect.assertions(12);
    const wrapper = renderComponent({
      ...props,
      settings: {
        ...props.settings,
        categoryNumber: '1',
      },
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(1);
    checkWrapper(wrapper, [
      { categoryId: '1', selectedId: null },
    ]);

    wrapper.find(Picker).at(0).simulate('click');
    wrapper.find(Picker).at(0).find('List button').at(0)
      .simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Connect(CategoryPicker)')).toHaveLength(1);
    checkWrapper(wrapper, [
      { categoryId: '1', selectedId: '1-1' },
    ], '1-1');
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
