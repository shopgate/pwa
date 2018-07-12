import { getModalState, getFirstModal, getModalById } from './modal';

const defaultEntry = {
  id: 'abc',
  confirm: null,
  dismiss: 'modal.dismiss',
  message: 'Message',
  params: {},
  title: 'Title',
  type: null,
};

const mockedState = {
  modal: [
    {
      ...defaultEntry,
    },
    {
      ...defaultEntry,
      id: '123',
    },
  ],
};

describe('Modal selectors', () => {
  describe('getModalState()', () => {
    it('should return an empty object if the modal state is not ready yet', () => {
      const result = getModalState({ });
      expect(result).toEqual([]);
    });
    it('should return an empty object if the modal state is empty', () => {
      const result = getModalState({ modal: [] });
      expect(result).toEqual([]);
    });

    it('should return the expected state', () => {
      const result = getModalState({ ...mockedState });
      expect(result).toEqual(mockedState.modal);
    });
  });

  describe('getFirstModal()', () => {
    it('should return undefined when the modal stack is empty', () => {
      const result = getFirstModal({ modal: [] });
      expect(result).toBeUndefined();
    });

    it('should return the first modal from the stack', () => {
      const result = getFirstModal({ ...mockedState });
      expect(result).toEqual(mockedState.modal[0]);
    });
  });

  describe('getModalById()', () => {
    it('should return undefined when the modal stack is empty', () => {
      const result = getModalById({ modal: [] });
      expect(result).toBeUndefined();
    });

    it('should return the correct modal from the stack', () => {
      const result = getModalById({ ...mockedState }, mockedState.modal[1].id);
      expect(result).toEqual(mockedState.modal[1]);
    });
  });
});
