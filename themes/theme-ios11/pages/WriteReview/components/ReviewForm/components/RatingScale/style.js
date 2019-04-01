import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

/**
 * The styles for the container element.
 */
const ratingLine = css({
  marginBottom: variables.gap.bigger,
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
}).toString();

/**
 * The styles for the rating scale.
 */
const scale = css({
  position: 'relative',
  float: 'right',
  marginRight: '-0.25em',
  flex: 'none',
});

/**
 * The styles for the rating scale label.
 */
const label = css({
  flex: 1,
}).toString();

/**
 * The styles for the error message.
 */
const error = css({
  textAlign: 'center',
  clear: 'both',
  bottom: '-1.5em',
  lineHeight: 'initial',
}).toString();

export default {
  error,
  scale,
  ratingLine,
  label,
};
