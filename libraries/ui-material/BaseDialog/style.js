import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const outerGap = 40;

const container = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: `calc(100vw - ${outerGap * 2}px)`,
  maxHeight: `calc(100vh - ${outerGap * 2}px)`,
  borderRadius: 2,
  boxShadow: themeConfig.shadows.dialog,
  background: themeConfig.colors.light,
}).toString();

const content = css({
  padding: themeConfig.variables.gap.small * 3,
}).toString();

const title = css({
  fontSize: '1.25em',
  lineHeight: themeConfig.typography.lineHeight,
  fontWeight: 500,
  paddingBottom: themeConfig.variables.gap.small,
  marginTop: '-.25em',
}).toString();

const body = css({
  color: themeConfig.colors.shade6,
  flexGrow: 1,
  overflow: 'auto',
}).toString();

const actions = css({
  alignSelf: 'flex-end',
  padding: themeConfig.variables.gap.small,
}).toString();

const innerActions = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
}).toString();

const button = css({
  marginRight: `-${themeConfig.variables.gap.small / 2}px`,
  textAlign: 'right',
}).toString();

export default {
  container,
  content,
  title,
  body,
  actions,
  innerActions,
  button,
};
