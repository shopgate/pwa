import { css } from 'glamor';
import variables from 'Styles/variables';
/**
 * Styles for a link parent container.
 * @type {string}
 */
const container = css({
  display: 'flex',
  justifyContent: 'flex-end',
  textAlign: 'right',
  marginTop: -variables.gap.small,
  marginBottom: -variables.gap.big,
});

export { container };
