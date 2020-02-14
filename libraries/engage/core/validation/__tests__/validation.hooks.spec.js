import { useState } from 'react';
import { useValidation } from '../validation.hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(fn => args => fn(args)),
}));

describe('engage > core > validation > hooks', () => {
  const constraints = {
    email: {
      presence: {
        message: 'validation.required',
        allowEmpty: false,
      },
      email: {
        message: 'validation.email',
      },
    },
  };

  it('initial state', () => {
    const setValid = jest.fn();
    const setValidationErrors = jest.fn();
    useState
      .mockReturnValueOnce([null, setValid])
      .mockReturnValueOnce([undefined, setValidationErrors]);

    const { valid, validationErrors, validate } = useValidation(constraints);

    expect(valid).toBeNull();
    expect(validationErrors).toBeUndefined();
    expect(validate).toBeInstanceOf(Function);
  });

  it('should validate', () => {
    const setValid = jest.fn();
    const setValidationErrors = jest.fn();
    useState
      .mockReturnValueOnce([true, setValid])
      .mockReturnValueOnce([{}, setValidationErrors]);

    const { validate } = useValidation(constraints);

    expect(validate).toBeInstanceOf(Function);

    validate({ email: 'mail@mail.com' });
    expect(setValid).toBeCalledWith(true);
    expect(setValidationErrors).toBeCalledWith(undefined);
  });

  it('should not validate', () => {
    const setValid = jest.fn();
    const setValidationErrors = jest.fn();
    useState
      .mockReturnValueOnce([true, setValid])
      .mockReturnValueOnce([{}, setValidationErrors]);

    const { validate } = useValidation(constraints);

    expect(validate).toBeInstanceOf(Function);

    validate({ email: 'mail@mail' });
    expect(setValid).toBeCalledWith(false);
    expect(setValidationErrors).toBeCalledWith({
      email: 'validation.email',
    });
  });
});
