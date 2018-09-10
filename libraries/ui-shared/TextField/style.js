import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

// Selects a date input that is not focused.
const bluredDateSelector = 'input[type="date"]:in-range:not(:focus)';

/**
 * The styles for the container element.
 */
const container = {
  input: css({
    position: 'relative',
    paddingBottom: themeConfig.variables.gap.big,
    width: '100%',
    // Fixes layout issue with webkit. Height is 0 in some webkit browsers.
    '& input[type="date"]': {
      minHeight: '1.3rem',
    },
    // Removes placeholder texts on chrome when input is not focused.
    [`& ${bluredDateSelector}::-webkit-datetime-edit-year-field, ` +
       `${bluredDateSelector}::-webkit-datetime-edit-month-field, ` +
       `${bluredDateSelector}::-webkit-datetime-edit-day-field, ` +
       `${bluredDateSelector}::-webkit-datetime-edit-text`
    ]: {
      color: 'transparent',
    },
  }).toString(),
  multiLine: css({
    position: 'relative',
    width: '100%',
  }).toString(),
};

export default {
  container,
};
