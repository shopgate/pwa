import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const regularColor = '#a1a1a1';

const container = css({
  display: 'flex',
  position: 'relative',
  flexBasis: 0,
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '0.64rem',
  height: '100%',
  padding: 0,
  '> svg': {
    flexGrow: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
}).toString();

const regular = css({
  color: regularColor,
}).toString();

const highlighted = css({
  color: colors.accent,
}).toString();

const label = css({
  marginBottom: 2,
}).toString();

const item = css({
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'space-between',
  height: '100%',
  marginTop: 5,
}).toString();

export default {
  container,
  item,
  regular,
  highlighted,
  label,
};
