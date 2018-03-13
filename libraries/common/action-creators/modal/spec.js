import {
  CREATE_MODAL,
  REMOVE_MODAL,
} from '../../constants/ActionTypes';
import {
  createModal,
  removeModal,
} from './index';

const options = { some: 'data' };
const id = 'modalId';

describe('Action Creators: modal', () => {
  describe('createModal()', () => {
    it('should work as expected', () => {
      const expected = {
        type: CREATE_MODAL,
        options,
      };
      expect(createModal(options)).toEqual(expected);
    });
  });

  describe('removeModal()', () => {
    it('should work as expected', () => {
      const expected = {
        type: REMOVE_MODAL,
        id,
      };
      expect(removeModal(id)).toEqual(expected);
    });
  });
});
