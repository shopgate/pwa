import {
  HISTORY_DID_RESET,
  HISTORY_WILL_RESET,
  OPEN_LINK,
  UPDATE_HISTORY,
} from '../../constants/ActionTypes';
import {
  historyDidReset,
  historyWillReset,
  openLink,
  updateHistory,
} from './index';

const dataMock = { some: 'data' };

describe('Action Creators: history', () => {
  describe('historyDidReset()', () => {
    it('should work as expected', () => {
      const expected = { type: HISTORY_DID_RESET };
      expect(historyDidReset()).toEqual(expected);
    });
  });

  describe('historyWillReset()', () => {
    it('should work as expected', () => {
      const expected = { type: HISTORY_WILL_RESET };
      expect(historyWillReset()).toEqual(expected);
    });
  });

  describe('openLink()', () => {
    it('should work as expected for an external link', () => {
      const name = 'externalLink';
      const options = 'https://www.shopgate.com';
      const expected = {
        type: OPEN_LINK,
        name,
        options,
      };

      expect(openLink(name, options)).toEqual(expected);
    });

    it('should work as expected for a react router call', () => {
      const name = 'reactRouter';
      const options = {
        url: '/',
        queryParams: {},
      };
      const expected = {
        type: OPEN_LINK,
        name,
        options,
      };

      expect(openLink(name, options)).toEqual(expected);
    });
  });

  describe('updateHistory()', () => {
    it('should work as expected', () => {
      const expected = {
        type: UPDATE_HISTORY,
        historyProps: dataMock,
      };
      expect(updateHistory(dataMock)).toEqual(expected);
    });
  });
});
