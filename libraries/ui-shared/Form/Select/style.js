import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const select = css({
  position: 'relative',
  padding: 0,
  width: '100%',
  margin: '24px 0 0 0',
  outline: 0,
  fontSize: 16,
  lineHeight: '19px',
}).toString();

export default {
  select,
};
