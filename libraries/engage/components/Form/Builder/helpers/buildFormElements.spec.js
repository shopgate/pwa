import { ELEMENT_TYPE_COUNTRY } from '../elementTypes';
import buildFormElements from './buildFormElements';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: () => {},
  },
}));

const formElementConfig = {
  sortOrder: 1,
  label: 'Label',
  type: 'text',
  default: 'default',
  placeholder: 'locales',
  required: true,
  visible: true,
};

const formElement = {
  id: 'field',
  sortOrder: 1,
  label: 'Label',
  type: 'text',
  default: 'default',
  placeholder: 'locales',
  required: true,
  visible: true,
  custom: false,
};

describe('buildFormElements', () => {
  it('should not build custom field', () => {
    const config = {
      fields: {
        custom: formElementConfig,
      },
    };
    expect(buildFormElements(config)).toEqual([]);
  });

  it('should not build empty config', () => {
    const config = {
      fields: {},
    };
    expect(buildFormElements(config)).toEqual([]);
  });

  it('should build text element', () => {
    const config = {
      fields: {
        field: formElementConfig,
      },
    };
    const { handleChange: ignore, ...restElement } = buildFormElements(config)[0];
    expect(restElement).toEqual(formElement);
  });

  it('should build 1 country element', () => {
    const config = {
      fields: {
        country: {
          ...formElementConfig,
          type: ELEMENT_TYPE_COUNTRY,
        },
        // eslint-disable-next-line camelcase
        country_2: {
          ...formElementConfig,
          type: ELEMENT_TYPE_COUNTRY,
        },
      },
    };
    const expected = {
      ...formElement,
      id: 'country',
      type: ELEMENT_TYPE_COUNTRY,
    };
    const { handleChange: ignore, ...restElement } = buildFormElements(config)[0];
    expect(restElement).toEqual(expected);
  });

  it('should build custom text element', () => {
    const config = {
      fields: {
        custom: {
          field: formElementConfig,
        },
      },
    };
    const expected = {
      ...formElement,
      custom: true,
    };
    const { handleChange: ignore, ...restElement } = buildFormElements(config)[0];
    expect(restElement).toEqual(expected);
  });

  it('should build correct change handler for text field', () => {
    const config = {
      fields: {
        field: formElementConfig,
      },
    };
    const mockHandler = jest.fn();
    const { handleChange } = buildFormElements(config, mockHandler)[0];

    // Invoke handler with field value
    handleChange('bar');
    expect(mockHandler).toBeCalledWith('field', 'bar');
  });
});
