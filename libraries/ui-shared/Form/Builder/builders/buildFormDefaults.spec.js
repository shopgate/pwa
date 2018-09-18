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

describe('buildFormDefaults', () => {
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
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const el = { ...formElement, custom: true };
    expect(buildFormDefaults([el], defaults)).toEqual(expected);
  });

  it('should build defaults for custom from object defaults', () => {
    const expected = {
      field: 'baz',
    };
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const el = { ...formElement, custom: true };
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const def = { ...defaults, customAttributes: { field: 'baz' } };
    expect(buildFormDefaults([el], def)).toEqual(expected);
  });
});
