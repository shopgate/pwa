import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
});

const image = css({
  margin: '0 auto',
  maxHeight: variables.navigator.height,
  maxWidth: `calc(100vw - ${(variables.navigator.height * 3) + variables.gap.xbig}px)`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export default {
  container,
  image,
};
