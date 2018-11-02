import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { basicProductState } from '@shopgate/pwa-common-commerce/product/mock';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { UnwrappedProductGallery } from './index';
import AppBar from './components/AppBar';
import Content from './components/Content';

const mockedStore = configureStore();

jest.mock('Components/View');
jest.mock('./components/AppBar');
jest.mock('./components/Content');

describe('<ProductGallery> page', () => {
  it('should render content and an appbar', () => {
    const store = mockedStore(basicProductState);
    const id = Object.keys(basicProductState.product.productsById)[0];

    const wrapper = mount((
      <Provider store={store}>
        <UnwrappedProductGallery id={id}/>
      </Provider>), mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(AppBar).length).toEqual(1);
    expect(wrapper.find(Content).length).toEqual(1);
  });
});
