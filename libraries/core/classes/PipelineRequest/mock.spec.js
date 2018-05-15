import { mockedPipelineRequestFactory } from './mock';
import * as errorHandleTypes from '../../constants/ErrorHandleTypes';

describe('MockPipelineRequest', () => {
  it(
    'should create class that extends MockedPipelineRequest and resolves on dispatch',
    () => new Promise((resolve, reject) => {
      const FirstClass = mockedPipelineRequestFactory((mockedInstance, res) => {
        expect(typeof mockedInstance === 'object').toBe(true);
        res(1);
      });
      expect(typeof FirstClass.mockedDispatchResolver).toBe('function');
      const firstInstance = new FirstClass('first');
      expect(firstInstance.name).toBe('first');
      expect(firstInstance.input).toEqual({});
      expect(firstInstance.errorBlacklist).toEqual([]);
      expect(firstInstance.handleErrors).toBe(errorHandleTypes.ERROR_HANDLE_DEFAULT);

      const afterSetInput = firstInstance.setInput({ firstOne: 1 });
      // Check if returns `this`
      expect(afterSetInput instanceof FirstClass).toBe(true);
      // Check if input is set
      expect(firstInstance.input).toEqual({ firstOne: 1 });

      const afterSetHandledErrors = firstInstance
        .setErrorBlacklist([1, 2])
        .setHandleErrors(errorHandleTypes.ERROR_HANDLE_SUPPRESS);
      expect(afterSetHandledErrors instanceof FirstClass).toBe(true);
      expect(afterSetInput.errorBlacklist).toEqual(afterSetHandledErrors.errorBlacklist);
      expect(afterSetHandledErrors.errorBlacklist).toEqual([1, 2]);
      expect(afterSetHandledErrors.handleErrors).toBe(errorHandleTypes.ERROR_HANDLE_SUPPRESS);
      // Check dispatch
      afterSetInput
        .dispatch()
        .then((value) => {
          expect(value).toBe(1);
          resolve();
        })
        .catch(() => {
          reject();
        });
    })
  );
  it(
    'should create another, independent class',
    () => new Promise((resolve, reject) => {
      const SecondClass = mockedPipelineRequestFactory((mockedInstance, res, rej) => {
        expect(typeof mockedInstance === 'object').toBe(true);
        rej(2);
      });
      const secondInstance = new SecondClass('second');
      expect(secondInstance.name).toBe('second');
      expect(secondInstance.input).toEqual({});

      const afterSetInput = secondInstance.setInput({ secondOne: 2 });
      expect(afterSetInput instanceof SecondClass).toBe(true);
      expect(afterSetInput.input).toEqual({ secondOne: 2 });
      afterSetInput
        .dispatch()
        .then(() => {
          reject();
        })
        .catch((val) => {
          expect(val).toBe(2);
          resolve();
        });
    })
  );
  it('should set defaults when calling methods', () => {
    const PipelineClass = mockedPipelineRequestFactory(() => {});
    const instance = new PipelineClass('third');
    instance
      .setInput()
      .setErrorBlacklist();
    expect(instance.input).toEqual({});
    expect(instance.errorBlacklist).toEqual([]);
  });
});
