/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import ProductImage from 'Components/ProductImage';
import ImageSlider from 'Components/ImageSlider';
import ProductImageSlider from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<ProductImageSlider />', () => {
  const mockStore = configureStore();
  const product = {
    featuredImageUrl: 'featured.png',
  };
  const images = [
    'foo/bar.png',
    'bar/foo.png',
  ];

  it('should render image placeholder if no data is available', () => {
    const store = mockStore({});
    const wrapper = mount(
      <ProductImageSlider store={store} product={null} images={null} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toEqual(0);
    expect(wrapper.find(ProductImage).length).toEqual(1);
    expect(wrapper.find(ImageSlider).length).toEqual(0);
  });

  it('should render featured image if only product data a is available', () => {
    const store = mockStore({});
    const wrapper = mount(
      <ProductImageSlider store={store} product={product} images={null} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProductImage).length).toEqual(1);
    expect(wrapper.find('img').length).toEqual(0);
    expect(wrapper.find(ProductImage).at(0).prop('src')).toEqual('featured.png');
    expect(wrapper.find(ImageSlider).length).toEqual(0);
  });

  it('should render image slider if all data is available', () => {
    const store = mockStore({});
    const wrapper = mount(
      <ProductImageSlider store={store} product={product} images={images} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ImageSlider).length).toEqual(1);

    expect(wrapper.find(ImageSlider).find(ProductImage).at(0).prop('src')).toEqual('foo/bar.png');
    expect(wrapper.find(ImageSlider).find(ProductImage).at(1).prop('src')).toEqual('bar/foo.png');
  });
});
