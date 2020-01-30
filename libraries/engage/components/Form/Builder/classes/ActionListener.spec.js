import ActionListener from './ActionListener';
import {
  ACTION_TYPE_SET_VISIBILITY,
  ACTION_TYPE_SET_VALUE,
  ACTION_TYPE_TRANSFORM,
  ACTION_SET_VALUE_COPY_FROM,
  ACTION_RULE_TYPE_ONE_OF,
} from './ActionListener.constants';

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
  DF: 'Default-State',
});

describe('ActionListener', () => {
  describe('createSetVisibilityHandler', () => {
    it('should handle visibility changes correctly', () => {
      // -------------------------------------------------------------------------------------------

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

      let nextState;
      let expected;

      // Perform "make visible" test
      nextState = {
        formData: { country: 'US' },
      };
      expected = {
        formData: { country: 'US' },
        elementVisibility: { province: true },
      };
      expect(handler({}, nextState)).toEqual(expected);

      // Perform "make invisible" test
      nextState = {
        formData: { country: '' },
      };
      expected = {
        formData: { country: '' },
        elementVisibility: { province: false },
      };
      expect(handler({}, nextState)).toEqual(expected);
    });

    it('should handle call follow up changes correctly when visibility changed', () => {
      // -------------------------------------------------------------------------------------------

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
      const handleVisibility = actionListener.createSetVisibilityHandler(element, action);

      // Province element is supposed to be hidden and therefore the follow up
      const followUpHandler = jest.fn();
      actionListener.register('province', followUpHandler);

      const prevState = { formData: { province: 'to be changed' } };
      const nextStateBeforeVisibilityChange = {
        formData: {
          country: '',
          province: 'to be changed',
        },
      };
      const nextStateAfterVisibilityChange = {
        elementVisibility: { province: false },
        formData: { country: '' },
      };
      handleVisibility(prevState, nextStateBeforeVisibilityChange);
      expect(followUpHandler).toHaveBeenCalledWith(prevState, nextStateAfterVisibilityChange);
    });
  });

  describe('updateProvinceElementHandler', () => {
    it('should select the first province in the list, when country changes and no default is ' +
      'available', () => {
      // -------------------------------------------------------------------------------------------

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

    it('should select the default province in the list on country changes when a match with ' +
      'default is available', () => {
      // -------------------------------------------------------------------------------------------

      const provinceElement = {
        id: 'province',
        default: 'DF',
        required: true,
      };
      const countryElement = {
        id: 'country',
        default: 'US',
      };
      const action = {
        type: 'update',
        rules: [{ context: countryElement.id }],
      };

      const prevState = {};
      const nextState = { formData: { [countryElement.id]: countryElement.default } };
      const expected = {
        formData: {
          [provinceElement.id]: provinceElement.default,
          [countryElement.id]: countryElement.default,
        },
      };

      // Defaults matches the same object structure as 'formData'
      const actionListener = new ActionListener(mockGetProvincesList, expected.formData);
      const handler = actionListener.createUpdateProvinceElementHandler(provinceElement, action);

      // Expects the handler to take over the defaults in this test
      expect(handler(prevState, nextState)).toEqual(expected);
    });
  });

  describe('setValueHandler', () => {
    it('should create copy the referenced element value into the current element', () => {
      // -------------------------------------------------------------------------------------------

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
  });

  describe('transformHandler', () => {
    it('should apply the transformHandler correctly for "String" operations', () => {
      // -------------------------------------------------------------------------------------------

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

    it('should apply the transformHandler correctly for "Boolean" operations', () => {
      // -------------------------------------------------------------------------------------------

      const element = {
        id: 'boolTest',
      };
      const action = {
        type: ACTION_TYPE_TRANSFORM,
        params: {
          type: 'toString',
        },
      };
      const actionListener = new ActionListener(mockGetProvincesList, {});
      const handler = actionListener.createTransformHandler(element, action);

      const prevState = { formData: { boolTest: true } };
      const nextState = { formData: { boolTest: true } };
      const expected = { formData: { boolTest: 'true' } };
      expect(handler(prevState, nextState)).toEqual(expected);
    });

    it('should apply the transformHandler correctly for "Number" operations', () => {
      // -------------------------------------------------------------------------------------------

      const element = {
        id: 'numberTest',
      };
      const action = {
        type: ACTION_TYPE_TRANSFORM,
        params: {
          type: 'isInteger',
        },
      };
      const actionListener = new ActionListener(mockGetProvincesList, {});
      const handler = actionListener.createTransformHandler(element, action);

      const prevState = { formData: { numberTest: 7.88 } };
      const nextState = { formData: { numberTest: 7.88 } };
      const expected = { formData: { numberTest: false } };
      expect(handler(prevState, nextState)).toEqual(expected);
    });
  });
});
