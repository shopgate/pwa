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

export default {
  container,
  disclaimer,
  discounted,
};
