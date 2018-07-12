import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import ProductImage from 'Components/ProductImage';
import ImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import { initialState } from '@shopgate/pwa-common-commerce/product/mock';
import { basicProductState } from '../mock';
import ProductImageSlider from './index';

jest.mock('@shopgate/react-hammerjs/src/Hammer', () => ({ children }) => children);

describe('<ProductImageSlider />', () => {
  const mockStore = configureStore([thunk]);
  const product = {
    featuredImageUrl: 'featured.png',
  };

  it('should render image placeholder if no data is available', () => {
    const store = mockStore(initialState);
    const wrapper = mount(<ProductImageSlider store={store} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
    expect(wrapper.find(ProductImage).length).toEqual(1);
    expect(wrapper.find(ImageSlider).length).toEqual(0);
  });

  it('should render featured image if only product data a is available', () => {
    const { productsById } = basicProductState.product;
    const { productId } = basicProductState.product.currentProduct;
    productsById[productId].productData.featuredImageUrl = product.featuredImageUrl;

    const state = {
      ...basicProductState,
      product: {
        ...basicProductState.product,
        productsById,
        imagesByProductId: {},
      },
    };
    const store = mockStore(state);
    const wrapper = mount(<ProductImageSlider store={store} productId={productId} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductImage).length).toEqual(1);
    expect(wrapper.find('img').length).toEqual(0);
    expect(wrapper.find(ProductImage).at(0).prop('src')).toEqual('featured.png');
    expect(wrapper.find(ImageSlider).length).toEqual(0);
  });

  it('should render image slider if all data is available', () => {
    const { productId } = basicProductState.product.currentProduct;

    const store = mockStore(basicProductState);
    const wrapper = mount(<ProductImageSlider store={store} productId={productId} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ImageSlider).length).toEqual(1);

    basicProductState.product.imagesByProductId[productId].images.forEach((url, index) => {
      expect(wrapper.find(ImageSlider).find(ProductImage).at(index).prop('src')).toEqual(url);
    });
  });

  it('should open gallery', () => {
    const { productId } = basicProductState.product.currentProduct;

    const store = mockStore(basicProductState);
    const wrapper = mount(<ProductImageSlider store={store} productId={productId} />);
    wrapper.find('ImageSlider').at(0).instance().handleOpenGallery();
    const navigateAction = [{
      type: 'NAVIGATE',
      action: 'PUSH',
      location: '/item/393133/gallery/0',
      state: undefined,
    }];

    expect(store.getActions()).toEqual(navigateAction);
  });
});
