import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const chevron = css({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%) rotateZ(-90deg)',
  fontSize: '1.3em !important',
  marginTop: -3,
}).toString();

const toggle = css({
  fontSize: '1rem',
  paddingRight: '2rem',
});

const itemSelected = css({
  backgroundColor: themeConfig.colors.shade8,
}).toString();

export default {
  chevron,
  toggle,
  itemSelected,
};
