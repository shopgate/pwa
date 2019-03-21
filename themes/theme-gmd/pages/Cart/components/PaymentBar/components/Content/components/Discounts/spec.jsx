import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { LoadingContext } from '@shopgate/pwa-common/providers';
import receiveCart from '@shopgate/pwa-common-commerce/cart/action-creators/receiveCart';
import reducers from 'Pages/reducers';
import Label from './components/Label';
import Amount from './components/Amount';
import Discounts from './';

const store = createMockStore(reducers);
const context = { isLoading: () => false };

describe('<Discounts />', () => {
  it('renders no discounts when the cart is not fetched', () => {
    const wrapper = mount((
      <Provider store={store}>
        <LoadingContext.Provider value={context}>
          <Discounts />
        </LoadingContext.Provider>
      </Provider>
    ));
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.html()).toEqual(null);
    wrapper.unmount();
  });

  it('renders discounts according to the cart data', () => {
    store.dispatch(receiveCart({
      totals: [
        {
          label: 'Coupon',
          amount: 5,
          type: 'discount',
        },
      ],
      currency: 'EUR',
    }));
    const wrapper = mount((
      <Provider store={store}>
        <LoadingContext.Provider value={context}>
          <Discounts />
        </LoadingContext.Provider>
      </Provider>
    ));
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find(Label).html()).toEqual('<div class="css-z3fwy2 " data-test-id="discountLabel"><span>Coupon</span><span>:</span></div>');
    expect(wrapper.find(Amount).html()).toEqual('<div class="css-13f0gfi "><span>-</span><span class="">5</span></div>');
  });
});
