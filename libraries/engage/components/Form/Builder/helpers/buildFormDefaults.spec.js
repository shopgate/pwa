/* eslint-disable extra-rules/no-single-line-objects */
import { ELEMENT_TYPE_SELECT } from '../Builder.constants';
import buildFormDefaults from './buildFormDefaults';

const formElement = {
  id: 'field',
  default: 'foo',
  custom: false,
};

const defaults = {
  field: 'baz',
  customAttributes: {},
};

describe('Builder/helpers/buildFormDefaults', () => {
  it('should build defaults from element defaults', () => {
    const expected = {
      field: 'foo',
    };
    expect(buildFormDefaults([formElement], {})).toEqual(expected);
  });

  it('should build defaults from object defaults ', () => {
    const expected = {
      field: 'baz',
    };
    expect(buildFormDefaults([formElement], defaults)).toEqual(expected);
  });

  it('should build defaults for custom from element defaults', () => {
    const expected = {
      field: 'foo',
    };
    const el = { ...formElement, custom: true };
    expect(buildFormDefaults([el], defaults)).toEqual(expected);
  });

  it('should build defaults for custom from object defaults', () => {
    const expected = {
      field: 'baz',
    };
    const el = { ...formElement, custom: true };
    const def = { ...defaults, customAttributes: { field: 'baz' } };
    expect(buildFormDefaults([el], def)).toEqual(expected);
  });

  describe('ELEMENT_TYPE_SELECT', () => {
    const options = { mr: 'Mr.', mrs: 'Mrs.' };

    it('should set default value', () => {
      const el = { ...formElement, type: ELEMENT_TYPE_SELECT, options };
      expect(buildFormDefaults([el])).toEqual({
        field: 'foo',
      });
    });
    it('should set first option', () => {
      const el = {
        ...formElement, type: ELEMENT_TYPE_SELECT, options, default: null,
      };
      expect(buildFormDefaults([el])).toEqual({
        field: 'mr',
      });
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */

