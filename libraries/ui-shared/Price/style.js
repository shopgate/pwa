import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  position: 'relative',
  whiteSpace: 'nowrap',
}).toString();

const disclaimer = css({
  color: 'initial',
  fontSize: 14,
  position: 'absolute',
  right: -10,
  top: 0,
}).toString();

const discounted = css({
  color: `var(--color-primary, ${themeConfig.colors.primary})`,
}).toString();

const hidden = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  border: 0,
}).toString();

export default {
  container,
  disclaimer,
  discounted,
  hidden,
};
