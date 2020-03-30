import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useFormState } from '../useFormState';

jest.mock('lodash', () => ({
  debounce: fn => fn,
}));

describe('engage > core > hooks -> useFormState', () => {
  const mockValidationConstraints = {
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
  const mockInitialState = { email: '' };

  /**
   * @param {Object} props props
   * @returns {*}
   */
  const TestComponent = ({
    initialState, validationConstraints, spy, submitSpy,
  }) => spy(useFormState(initialState, submitSpy, validationConstraints));

  let spy;
  let submitSpy;
  beforeEach(() => {
    spy = jest.fn().mockReturnValue(null);
    submitSpy = jest.fn();
    mount(<TestComponent
      spy={spy}
      submitSpy={submitSpy}
      initialState={mockInitialState}
      validationConstraints={mockValidationConstraints}
    />);
  });

  it('initial state', () => {
    expect(spy).toBeCalledWith(expect.objectContaining({
      handleChange: expect.any(Function),
      handleSubmit: expect.any(Function),
      values: { email: '' },
      valid: null,
      validationErrors: undefined,
    }));
  });

  it('trigger changed', () => {
    const { handleChange } = spy.mock.calls[0][0];

    act(() => handleChange('mail@mail.com', { target: { name: 'email' } }));

    expect(spy).nthCalledWith(2, expect.objectContaining({
      values: { email: 'mail@mail.com' },
      valid: null,
      validationErrors: undefined,
    }));
  });

  it('should not trigger submitting when initial validation fails', () => {
    const { handleSubmit } = spy.mock.calls[0][0];

    act(() => handleSubmit({ preventDefault: jest.fn() }));

    expect(submitSpy).toBeCalledTimes(0);
    expect(spy).nthCalledWith(4, expect.objectContaining({
      values: { email: '' },
      valid: false,
      validationErrors: { email: 'validation.required' },
    }));
  });

  it('trigger submitting', () => {
    const { handleChange, handleSubmit } = spy.mock.calls[0][0];
    act(() => handleChange('mail@mail.com', { target: { name: 'email' } }));
    act(() => handleSubmit({ preventDefault: jest.fn() }));

    expect(submitSpy).toBeCalledWith({ email: 'mail@mail.com' });
  });

  it('should not trigger submitting when validation fails', () => {
    const { handleChange, handleSubmit } = spy.mock.calls[0][0];

    act(() => handleChange('mail@mail', { target: { name: 'email' } }));
    act(() => handleSubmit({ preventDefault: jest.fn() }));

    expect(submitSpy).toBeCalledTimes(0);
    expect(spy).nthCalledWith(5, expect.objectContaining({
      values: { email: 'mail@mail' },
      valid: false,
      validationErrors: { email: 'validation.email' },
    }));
  });
});
