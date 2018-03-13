import {
  REQUEST_MENU,
  RECEIVE_MENU,
  ERROR_MENU,
} from '../../constants/ActionTypes';
import {
  requestMenu,
  receiveMenu,
  errorMenu,
} from './index';

const entries = [{
  url: '/',
  label: 'Page Label',
}];

const id = 'quicklinks';

describe('Action Creators: menu', () => {
  describe('requestMenu()', () => {
    it('should work as expected', () => {
      const expected = {
        type: REQUEST_MENU,
        id,
      };
      expect(requestMenu(id)).toEqual(expected);
    });
  });

  describe('receiveMenu()', () => {
    it('should work as expected', () => {
      const expected = {
        type: RECEIVE_MENU,
        id,
        entries,
      };
      expect(receiveMenu(id, entries)).toEqual(expected);
    });
  });

  describe('errorMenu()', () => {
    it('should work as expected', () => {
      const expected = {
        type: ERROR_MENU,
        id,
      };
      expect(errorMenu(id)).toEqual(expected);
    });
  });
});
