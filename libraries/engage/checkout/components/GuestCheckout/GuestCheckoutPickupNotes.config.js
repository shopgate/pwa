import { i18n } from '@shopgate/engage/core/helpers';

/**
 * Generates form configuration.
 * @returns {Object}
 */
const generateFormConfig = () => ({
  fields: {
    instructions: {
      type: 'text',
      label: i18n.text('checkout.pickup_contact.form.instructions'),
    },
  },
});

export default generateFormConfig;
