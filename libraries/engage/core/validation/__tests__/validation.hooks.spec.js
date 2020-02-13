import { useState } from 'react';
import {
  VALIDATION_EMAIL,
  VALIDATION_REQUIRED,
  validationErrors as constValidationErrors,
} from '../validation.constants';
import { useValidation } from '../validation.hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
  useCallback: jest.fn(fn => args => fn(args)),
}));

describe('engage > core > validation > hooks', () => {
  it('should not validate', () => {
    const setValid = jest.fn();
    const setValidationErrors = jest.fn();
    useState
      .mockReturnValueOnce([true, setValid])
      .mockReturnValueOnce([{}, setValidationErrors]);

    const { validate } = useValidation({
      firstName: VALIDATION_REQUIRED,
      email: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
    });

    expect(validate).toBeInstanceOf(Function);

    validate({
      firstName: '',
      email: 'mail@mail',
    });
    expect(setValid).toBeCalledWith(false);
    expect(setValidationErrors).toBeCalledWith({
      firstName: constValidationErrors[VALIDATION_REQUIRED],
      email: constValidationErrors[VALIDATION_EMAIL],
    });
  });
});
