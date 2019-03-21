import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { LoadingContext } from '@shopgate/pwa-common/providers';
import receiveCart from '@shopgate/pwa-common-commerce/cart/action-creators/receiveCart';
import reducers from 'Pages/reducers';
import Label from './components/Label';
import Amount from './components/Amount';
import Tax from './';

const store = createMockStore(reducers);
const context = { isLoading: () => false };

describe('<Tax />', () => {
  it('renders no tax information when the cart is not fetched', () => {
    const wrapper = mount((
      <Provider store={store}>
        <LoadingContext.Provider value={context}>
          <Tax />
        </LoadingContext.Provider>
      </Provider>
    ));
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.html()).toEqual(null);
    wrapper.unmount();
  });

  it('renders tax information according to the cart data', () => {
    store.dispatch(receiveCart({
      totals: [
        {
          label: 'incl. 19% VAT',
          amount: 19,
          type: 'tax',
        },
      ],
      currency: 'EUR',
    }));
    const wrapper = mount((
      <Provider store={store}>
        <LoadingContext.Provider value={context}>
          <Tax />
        </LoadingContext.Provider>
      </Provider>
    ));
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find(Label).html()).toEqual('<div class="css-z3fwy2 " data-test-id="taxLabel"><span>incl. 19% VAT</span><span>:</span></div>');
    expect(wrapper.find(Amount).html()).toEqual('<div class="css-13f0gfi "><span>-</span><span class="">19</span></div>');
  });
});
