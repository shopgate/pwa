import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const container = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
});

const image = css({
  margin: '0 auto',
  maxHeight: 44,
  maxWidth: `calc(100vw - ${(44 * 3) + variables.gap.xbig}px)`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default {
  container,
  image,
};
