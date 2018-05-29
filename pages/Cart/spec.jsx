import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockedView } from 'Components/View/mock';
import { mount } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import { emptyState, cartState } from '@shopgate/pwa-common-commerce/cart/mock';

const mockedView = MockedView;
const mockedStore = configureStore();
jest.mock('Components/View', () => mockedView);
let store;
/**
 * Creates component
 * @param {boolean} state State that would be used for store.
 * @return {ReactWrapper}
 */
const createComponent = (state) => {
  store = mockedStore(state);
  /* eslint-disable global-require */
  const Cart = require('./index').default;
  /* eslint-enable global-require */
  return mount(
    <Provider store={store} >
      <Cart />
    </Provider>,
    mockRenderOptions
  );
};

describe('<Cart> page', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('Initial page', () => {
    it('should render empty', () => {
      const component = createComponent(emptyState);
      expect(component).toMatchSnapshot();
      expect(component.find('Cart').length).toEqual(1);
      expect(component.find('Empty').length).toEqual(1);
      expect(component.find('RippleButton').length).toEqual(1);
    });

    it('should navigate back on button press', () => {
      /*const component = createComponent(emptyState);
      expect(component).toMatchSnapshot();
      const RippleButton = component.find('RippleButton');
      RippleButton.simulate('click');
      component.update();*/
    });

    it('should render with items', () => {
      const component = createComponent(cartState);
      expect(component).toMatchSnapshot();
      expect(component.find('Cart').length).toEqual(1);
      expect(component.find('Item').length).toEqual(1);
      expect(component.find('PaymentBar').length).toEqual(1);
      expect(component.find('Footer').length).toEqual(1);
    });

    it('should navigate to PDP on item tap', () => {

    });

    it('should update quantity', () => {

    });
  });
});
