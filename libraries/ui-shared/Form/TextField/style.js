import { css } from 'glamor';

// Selects a date input that is not focused.
const bluredDateSelector = 'input[type="date"]:in-range:not(:focus)';

/**
 * The styles for the input field.
 */
const input = css({
  position: 'relative',
  padding: 0,
  width: '100%',
  marginTop: 24,
  outline: 0,
  fontSize: 16,
  lineHeight: '19px',
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
}).toString();

/**
 * The styles for the multiLine.
 */
const multiLine = css({
  position: 'relative',
  marginTop: 24,
  marginBottom: 3,
  padding: 0,
  width: '100%',
  outline: 0,
  height: 19,
  minHeight: 19,
  lineHeight: '19px',
  verticalAlign: 'top', // Important to avoid bottom whitespace.
}).toString();

const element = css({
  marginTop: 16,
}).toString();

export default {
  input,
  multiLine,
  element,
};
