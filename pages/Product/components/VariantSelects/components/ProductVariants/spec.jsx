import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import cloneDeep from 'lodash/cloneDeep';
import { mockedPipelineRequestFactory } from '@shopgate/pwa-core/classes/PipelineRequest/mock';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import * as mockData from './mock';

const mockedResolver = jest.fn();
jest.mock('@shopgate/pwa-core/classes/PipelineRequest', () => mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
  mockedResolver(mockInstance, resolve, reject);
}));

/**
 * Creates component
 * @param {Object} state State
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  const mockedStore = configureStore([thunk]);
  /* eslint-disable global-require */
  const VariantSelects = require('./../../index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={mockedStore(state)}>
      <VariantSelects />
    </Provider>,
    mockRenderOptions
  );
};

describe('<ProductVariants />', () => {
  it('shouldn\'t render without variants', () => {
    const state = cloneDeep(mockData.mockedState);
    state.product.variantsByProductId = {};
    const wrapper = createComponent(state);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VariantSelects').children().length).toEqual(0);
    expect(wrapper.find('VariantSelects').prop('selection')).toBeFalsy();
    expect(wrapper.find('VariantSelects').prop('variants')).toBeFalsy();
  });

  it('should render with variants', () => {
    const wrapper = createComponent(mockData.mockedState);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VariantSelects').children().length).toEqual(1);

    expect(wrapper.find('VariantSelects').prop('selection')).toEqual(mockData.initialSelection);
  });

  it('should preselect variant', () => {
    const state = cloneDeep(mockData.mockedState);
    state.product.currentProduct.productVariantId = '1013-1018';

    const selection = createComponent(state).find('VariantSelects').prop('selection');
    expect(selection[0].value).toEqual('2');
    expect(selection[1].value).toEqual('2');
  });

  it('should update after selectionUpdate', () => {
    const state = cloneDeep(mockData.mockedState);
    state.product.currentProduct.productVariantId = '1013-1018';
    const wrapper = createComponent(state);

    wrapper.find('VariantSelects').prop('handleSelectionUpdate')('1', '1');
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('VariantSelects').prop('selection')).toEqual(mockData.selectionUpdate);

    wrapper.find('VariantSelects').prop('handleSelectionUpdate')('2', '2');
    wrapper.update();

    expect(wrapper.find('VariantSelects').prop('selection')).toEqual(mockData.selectionDone);
  });
});
