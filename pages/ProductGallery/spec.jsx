import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { basicProductState } from '@shopgate/pwa-common-commerce/product/mock';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { UnwrappedProductGallery } from './index';

const mockedStore = configureStore();
jest.mock('Components/View');
jest.mock('@shopgate/react-hammerjs', () => require.requireActual('./mock').MockedComponent);

describe('<ProductGallery> page', () => {
  /**
   * Creates a connected component.
   * @param {Object} state The component state.
   * @param {Object} props The component props.
   * @return {ReactWrapper}
   */
  const createComponent = (state, props) => {
    const store = mockedStore(state);
    return mount(
      <Provider store={store} >
        <UnwrappedProductGallery {...props} />
      </Provider>,
      mockRenderOptions
    );
  };

  it('should render', () => {
    const id = Object.keys(basicProductState.product.productsById)[0];
    const component = createComponent(basicProductState, { id });
    expect(component).toMatchSnapshot();
    expect(component.find('Image').length).toEqual(1);
  });
});
