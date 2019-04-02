import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const list = css({
  fontSize: 14,
  fontWeight: 400,
  marginTop: 4,
  position: 'relative',
});

const item = css({
  alignItems: 'center',
  background: colors.light,
  display: 'flex',
  height: 48,
  marginTop: 2,
  outline: 0,
  padding: '0 16px 0 72px',
  width: '100%',
  textAlign: 'left',
});

export default {
  list,
  item,
};
