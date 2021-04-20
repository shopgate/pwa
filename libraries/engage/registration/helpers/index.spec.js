import { convertSubmitRegistrationValidationErrors as convert } from './index';

describe('Registration helpers', () => {
  describe('.convertSubmitRegistrationValidationErrors()', () => {
    it('should return null when the input is no array', () => {
      expect(convert()).toBe(null);
      expect(convert('test')).toBe(null);
      expect(convert(123)).toBe(null);
      expect(convert({})).toBe(null);
    });

    it('should return null when the input is an empty array', () => {
      expect(convert([])).toBe(null);
    });

    it.only('should return converted validation errors', () => {
      const errors = [
        {
          entityIndex: 0,
          entity: 'customer',
          entityId: null,
          code: 400,
          message: 'The minimum password length must be 8 characters',
          subentityPath: ['password'],
        },
        {
          entityIndex: 0,
          entity: 'customer',
          entityId: null,
          code: 400,
          message: 'Please enter a valid street with house number',
          subentityPath: ['contacts', 1, 'address1'],
        },
        {
          entityIndex: 0,
          entity: 'customer',
          entityId: null,
          code: 400,
          message: 'This is not a valid zip code (5 digit number)',
          subentityPath: ['contacts', 1, 'postalCode'],
        },
        {
          entityIndex: 0,
          entity: 'customer',
          entityId: null,
          code: 409,
          message: 'Email address is already in use',
          subentityPath: ['emailAddress'],
        },
        {
          entityIndex: null,
          entity: 'order',
          entityId: '12345',
          code: 500,
          message: 'Some error occurred',
          subentityPath: [],
        },
      ];

      const result = convert(errors);
      expect(result).toEqual({
        general: [{
          entityIndex: null,
          entity: 'order',
          entityId: '12345',
          code: 500,
          message: 'Some error occurred',
          subentityPath: [],
        }],
        validation: {
          password: 'validation.checkField',
          emailAddress: 'validation.emailConflict',
          contacts: {
            1: {
              address1: 'validation.checkField',
              postalCode: 'validation.checkField',
            },
          },
        },
      });
    });

    it('should return converted validation errors', () => {
      const errors = [
        {
          code: 'INVALID_FORMAT',
          message: "Object didn't pass validation for format email: foo",
          path: [
            'customers',
            '0',
            'contacts',
            '1',
            'emailAddress',
          ],
        },
        {
          code: 'MIN_LENGTH',
          message: 'String is too short (1 chars), minimum 8',
          path: [
            'customers',
            '0',
            'password',
          ],
        },
        {
          code: 'INVALID_FORMAT',
          message: "Object didn't pass validation for format email: foo",
          path: [
            'customers',
            '0',
            'emailAddress',
          ],
        },
      ];

      const result = convert(errors);
      expect(result).toEqual({
        general: [],
        validation: {
          password: 'validation.checkField',
          emailAddress: 'validation.checkField',
          contacts: {
            1: { emailAddress: 'validation.checkField' },
          },
        },
      });
    });
  });
});
