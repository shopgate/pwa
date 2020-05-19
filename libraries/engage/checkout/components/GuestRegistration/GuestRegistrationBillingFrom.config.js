import { i18n } from '@shopgate/engage/core';

/**
 * Returns the field label.
 * @param {string} fieldName The name of the field.
 * @param {Array} requiredFields Array of all required fields.
 * @returns {string}
 */
const getFieldLabel = (fieldName, requiredFields) => {
  const isRequired = requiredFields.includes(fieldName);
  return `${i18n.text(`checkout.pickup_contact.form.${fieldName}`)}${isRequired ? ' *' : ''}`;
};

/**
 * Generates form configuration.
 * @param {Array} supportedCountries A list of supported countries.
 * @param {Object} userLocation User location for better phone picker defaults.
 * @param {Array} requiredFields Array of all required fields.
 * @param {boolean} orderReserveOnly Tells if the current order is reserve only
 * @returns {Object}
 */
const generateFormConfig = (supportedCountries, userLocation, requiredFields, orderReserveOnly) => {
  if (orderReserveOnly) {
    return {
      fields: {
        firstName: {
          type: 'text',
          label: getFieldLabel('firstName', requiredFields),
        },
        lastName: {
          type: 'text',
          label: getFieldLabel('lastName', requiredFields),
        },
        emailAddress: {
          type: 'email',
          label: getFieldLabel('emailAddress', requiredFields),
        },
        mobile: {
          type: 'phone_picker',
          label: getFieldLabel('mobile', requiredFields),
          config: {
            supportedCountries,
            userLocation,
          },
        },
      },
    };
  }

  return {
    fields: {
      firstName: {
        type: 'text',
        label: getFieldLabel('firstName', requiredFields),
      },
      lastName: {
        type: 'text',
        label: getFieldLabel('lastName', requiredFields),
      },
      emailAddress: {
        type: 'email',
        label: getFieldLabel('emailAddress', requiredFields),
      },
      mobile: {
        type: 'phone_picker',
        label: getFieldLabel('mobile', requiredFields),
        config: {
          supportedCountries,
          userLocation,
        },
      },
      company: {
        type: 'text',
        label: getFieldLabel('company', requiredFields),
      },
      address1: {
        type: 'text',
        label: getFieldLabel('address1', requiredFields),
      },
      address2: {
        type: 'text',
        label: getFieldLabel('address2', requiredFields),
      },
      postalCode: {
        type: 'text',
        label: getFieldLabel('postalCode', requiredFields),
      },
      city: {
        type: 'text',
        label: getFieldLabel('city', requiredFields),
      },
      country: {
        type: 'country',
        label: getFieldLabel('country', requiredFields),
        countries: supportedCountries,
      },
      region: {
        type: 'province',
        label: getFieldLabel('region', requiredFields),
        required: true,
      },
    },
  };
};

export default generateFormConfig;
