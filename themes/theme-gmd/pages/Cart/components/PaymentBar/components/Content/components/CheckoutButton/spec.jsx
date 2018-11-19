import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Link from '@shopgate/pwa-common/components/Link';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { createMockStore } from '@shopgate/pwa-common/store';
import CheckoutButton from './index';

const store = createMockStore();

// Mock the history connector
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isOrderable: false,
  };

  return newObj;
});

describe('<CheckoutButton />', () => {
  jest.useFakeTimers();

  let wrapper;
  let childLink;

  describe('Checkout is possible', () => {
    beforeEach(() => {
      wrapper = mount((
        <Provider store={store}>
          <LoadingProvider>
            <CheckoutButton />
          </LoadingProvider>
        </Provider>
      ));
      childLink = wrapper.find(Link);
    });

    it('should render without any props', () => {
      expect(wrapper).toMatchSnapshot();
      expect(childLink.props().disabled).toBe(true);
      expect(wrapper.text()).toBe('cart.checkout');
    });
  });
});
