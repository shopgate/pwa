import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { defaultContext } from '../../__mocks__/context';
import { basicProductState } from './../mock';

const mockedStore = configureStore([thunk]);

jest.mock('@shopgate/react-hammerjs/src/Hammer', () => ({ children }) => children);

jest.mock('Components/Reviews/components/Header', () => function () {
  return (<div />);
});
jest.mock('./../../context');

describe('<ProductContent>', () => {
  const createComponent = (state) => {
    // eslint-disable-next-line global-require
    const ProductContent = require('./index').default;
    const store = mockedStore(state);
    return mount(
      <Provider store={store}>
        <ProductContent productId={state.product.currentProduct.productId} />
      </Provider>,
      mockRenderOptions
    );
  };

  beforeEach(() => {
    jest.resetModules();
  });

  it('should render', () => {
    const { productId } = basicProductState.product.currentProduct;
    defaultContext.productId = productId;
    const cmp = createComponent(basicProductState);
    expect(cmp).toMatchSnapshot();
    expect(cmp.find('ProductHeader').length).toEqual(1);
    expect(cmp.find('Characteristics').length).toEqual(1);
    expect(cmp.find('Options').length).toEqual(1);
    expect(cmp.find('TaxDisclaimer').length).toEqual(1);
  });
});
