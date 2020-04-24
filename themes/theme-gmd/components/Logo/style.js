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
  maxHeight: variables.navigator.height,
  maxWidth:
    `calc(var(--page-content-width) - ${(variables.navigator.height * 3) + variables.gap.xbig}px)`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default {
  container,
  image,
};
