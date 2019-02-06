import { OPTION_TYPE_TEXT } from '../../constants';

/**
 * Formats the options from the API to a format our frontend needs.
 * @param {Object} options Product options
 * @return {Array} The formatted options
 */
const formatOptions = options => options.map(option => ({
  ...option,
  ...option.values && {
    values: option.values.map(value => ({
      ...value,
      unitPriceModifier: value.unitPriceModifier || 0,
    })),
  },
  ...option.type === OPTION_TYPE_TEXT && {
    unitPriceModifier: option.unitPriceModifier || 0,
  },
}));

export default formatOptions;
