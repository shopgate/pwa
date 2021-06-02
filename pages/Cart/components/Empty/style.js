import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  background: colors.shade8,
  textAlign: 'center',
  height: '100%',
}).toString();

const container = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: '1',
  flexShrink: '0',
}).toString();

const icon = css({
  width: variables.emptyPage.icon,
}).toString();

const title = css({
  textAlign: 'center',
  paddingTop: variables.emptyPage.titleTopGap,
}).toString();

export default {
  wrapper,
  container,
  icon,
  title,
};
