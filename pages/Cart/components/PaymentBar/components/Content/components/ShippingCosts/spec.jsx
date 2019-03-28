import React from 'react';
import { mount } from 'enzyme';
import TotalRow from '../TotalRow';
import ShippingCosts from './';

let mockedContext = {
  showShipping: true,
  shippingConfig: {
    hideFreeShipping: false,
    hideAnonymous: false,
  },
  isUserLoggedIn: true,
};
jest.mock('./components/Label');
jest.mock('./components/Amount');
jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children(mockedContext)),
}));

describe('<ShippingCosts>', () => {
  describe('should render shipping costs', () => {
    it('should render by config', () => {
      expect(mount(<ShippingCosts />).find(TotalRow).length).toBe(1);
    });
    it('should render for logged in user', () => {
      mockedContext = {
        ...mockedContext,
        shippingConfig: { hideAnonymous: true },
        isUserLoggedIn: true,
      };
      expect(mount(<ShippingCosts />).find(TotalRow).length).toBe(1);
    });
  });
  describe('should not render shipping costs', () => {
    it('should not render by config', () => {
      mockedContext = {
        ...mockedContext,
        showShipping: false,
      };
      expect(mount(<ShippingCosts />).find(TotalRow).length).toBe(0);
    });
    it('should not render for anonymous', () => {
      mockedContext = {
        ...mockedContext,
        shippingConfig: { hideAnonymous: true },
        isUserLoggedIn: false,
      };
      expect(mount(<ShippingCosts />).find(TotalRow).length).toBe(0);
    });
  });
});
