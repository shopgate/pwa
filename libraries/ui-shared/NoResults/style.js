import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const wrapper = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  textAlign: 'center',
  background: themeConfig.colors.shade8,
}).toString();

const icon = css({
  width: 216,
  color: `var(--color-primary, ${themeConfig.colors.primary})`,
}).toString();

const headline = css({
  fontSize: '1.25rem',
  fontWeight: 500,
  marginTop: 30,
}).toString();

const text = css({
  marginTop: themeConfig.variables.gap.big,
  padding: `0 ${themeConfig.variables.gap.big}px`,
}).toString();

export default {
  wrapper,
  icon,
  headline,
  text,
};
