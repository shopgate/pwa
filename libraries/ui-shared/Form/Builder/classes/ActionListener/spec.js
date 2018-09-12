import ActionListener from './index';
import {
  ACTION_TYPE_SET_VISIBILITY,
  ACTION_TYPE_SET_VALUE,
  ACTION_TYPE_TRANSFORM,
  ACTION_SET_VALUE_COPY_FROM,
  ACTION_RULE_TYPE_ONE_OF,
} from './constants';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: () => {},
  },
}));

/**
 * Mock for provinces
 * @returns {{ST: string}}
 */
const mockGetProvincesList = () => ({
  ST: 'State',
});

describe('ActionListener', () => {
  it('should create correct createSetVisibilityHandler', () => {
    const element = { id: 'province' };
    const action = {
      type: ACTION_TYPE_SET_VISIBILITY,
      rules: [{
        context: 'country',
        type: ACTION_RULE_TYPE_ONE_OF,
        data: ['US'],
      }],
    };
    const actionListener = new ActionListener(mockGetProvincesList, {});
    const handler = actionListener.createSetVisibilityHandler(element, action);

    const prevState = {
      formData: { country: '' },
      elementVisibility: { province: false },
    };
    const nextState = {
      formData: { country: 'US' },
      elementVisibility: { province: false },
    };
    const expected = {
      formData: { country: 'US' },
      elementVisibility: { province: true },
    };
    expect(handler(prevState, nextState)).toEqual(expected);
  });

  it('should create correct updateProvinceElementHandler', () => {
    const element = {
      id: 'province',
      required: true,
    };
    const action = {
      type: 'update',
      rules: [{ context: 'country' }],
    };
    const actionListener = new ActionListener(mockGetProvincesList, {});
    const handler = actionListener.createUpdateProvinceElementHandler(element, action);

    const prevState = { formData: { province: '' } };
    const nextState = { formData: { country: 'US' } };
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const expected = { formData: { country: 'US', province: 'ST' } };
    expect(handler(prevState, nextState)).toEqual(expected);
  });

  it('should create correct setValueHandler', () => {
    const element = {
      id: 'street2',
    };
    const action = {
      type: ACTION_TYPE_SET_VALUE,
      params: {
        type: ACTION_SET_VALUE_COPY_FROM,
        value: 'street',
      },
    };
    const actionListener = new ActionListener(mockGetProvincesList, {});
    const handler = actionListener.createSetValueHandler(element, action);

    // eslint-disable-next-line extra-rules/no-single-line-objects
    const prevState = { formData: { street: '', street2: '' } };
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const nextState = { formData: { street: 'Street 1', street2: '' } };
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const expected = { formData: { street: 'Street 1', street2: 'Street 1' } };
    expect(handler(prevState, nextState)).toEqual(expected);
  });

  it('should create correct transformHandler', () => {
    const element = {
      id: 'street',
    };
    const action = {
      type: ACTION_TYPE_TRANSFORM,
      params: {
        type: 'toUpperCase',
      },
    };
    const actionListener = new ActionListener(mockGetProvincesList, {});
    const handler = actionListener.createTransformHandler(element, action);

    const prevState = { formData: { street: '' } };
    const nextState = { formData: { street: 'Street' } };
    const expected = { formData: { street: 'STREET' } };
    expect(handler(prevState, nextState)).toEqual(expected);
  });
});
