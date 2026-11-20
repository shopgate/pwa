import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_MORE,
  TAB_FAVORITES,
} from '../constants';

import helper from './getTabActionComponentForType';

jest.mock('../components/CoreTabAction', () => ({
  createCoreTabAction: tabType => ({ tabType }),
}));

describe('getTabActionComponentForType', () => {
  describe('TAB_HOME', () => {
    it('should work as expected', () => {
      expect(helper(TAB_HOME)).toEqual({ tabType: TAB_HOME });
    });
  });

  describe('TAB_BROWSE', () => {
    it('should work as expected', () => {
      expect(helper(TAB_BROWSE)).toEqual({ tabType: TAB_BROWSE });
    });
  });

  describe('TAB_CART', () => {
    it('should work as expected', () => {
      expect(helper(TAB_CART)).toEqual({ tabType: TAB_CART });
    });
  });

  describe('TAB_MORE', () => {
    it('should work as expected', () => {
      expect(helper(TAB_MORE)).toEqual({ tabType: TAB_MORE });
    });
  });

  describe('TAB_FAVORITES', () => {
    it('should work as expected', () => {
      expect(helper(TAB_FAVORITES)).toEqual({ tabType: TAB_FAVORITES });
    });
  });

  describe('unknown', () => {
    it('should return undefined', () => {
      expect(helper('unknown')).toBeUndefined();
    });
  });
});
