import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import {
  getProductImages,
  getCurrentBaseProduct,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import Image from '@shopgate/pwa-common/components/Image';
import ZoomPanSlider from '../ZoomPanSlider';
import Content from './index';

jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProductImages: jest.fn(),
  getCurrentBaseProduct: jest.fn(),
}));
jest.mock('../ZoomPanSlider', () => ({ children }) => children);

const mockedStore = configureStore();

describe('<ProductGallery.Content> page', () => {
  beforeEach(() => {
    getProductImages.mockReturnValue(['foo', 'bar'])
    getCurrentBaseProduct.mockReturnValue({ id: 123 })
  });

  it('should render ZoomPanSlider with images', () => {
    const store = mockedStore();

    const wrapper = mount((
      <Provider store={store}>
        <Content initialSlide={0} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ZoomPanSlider).length).toEqual(1);
    expect(wrapper.find(Image).length).toEqual(2);
    expect(wrapper.find(Image).at(0).prop('src')).toEqual('foo');
    expect(wrapper.find(Image).at(1).prop('src')).toEqual('bar');
  });

  it('should pass initialSlide prop', () => {
    const store = mockedStore();

    const wrapper = mount((
      <Provider store={store}>
        <Content initialSlide={3} />
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ZoomPanSlider).prop('initialSlide')).toEqual(3);
  });
});
