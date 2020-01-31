/**
 * Provides class names to the components to allow customisation
 * @param {string} name Form name to prefix class names with
 * @returns {Object}
 */
export const getElementStyles = name => ({
  form: {
    className: `${name}_form`,
  },
  formElement: {
    className: `${name}_formElement`,
    placeholder: {
      className: `${name}_formElement_placeholder`,
    },
    label: {
      className: `${name}_formElement_label`,
    },
    underline: {
      className: `${name}_formElement_underline`,
    },
    errorText: {
      className: `${name}_formElement_errorText`,
    },
  },
  checkbox: {
    className: `${name}_checkbox`,
    label: {
      className: `${name}_checkbox_label`,
    },
    icon: {
      checked: {
        className: `${name}_checkbox_icon_checked`,
      },
      unchecked: {
        className: `${name}_checkbox_icon_unchecked`,
      },
    },
  },
  radio: {
    className: `${name}_radio`,
    item: {
      label: {
        className: `${name}_radio_item_label`,
      },
      icon: {
        checked: {
          className: `${name}_radio_item_icon_checked`,
        },
        unchecked: {
          className: `${name}_radio_item_icon_unchecked`,
        },
      },
      input: {
        className: `${name}_radio_item_input`,
      },
      text: {
        className: `${name}_radio_item_text`,
      },
    },
  },
  select: {
    className: `${name}_select`,
    item: {
      className: `${name}_select_item`,
    },
  },
  textField: {
    className: `${name}_textField`,
    hint: {
      className: `${name}_textField_hint`,
    },
    label: {
      className: `${name}_textField_label`,
    },
    input: {
      className: `${name}_textField_input`,
    },
    multiLine: {
      className: `${name}_textField_multiLine`,
    },
    underline: {
      className: `${name}_textField_underline`,
    },
    errorText: {
      className: `${name}_textField_errorText`,
    },
  },
});
