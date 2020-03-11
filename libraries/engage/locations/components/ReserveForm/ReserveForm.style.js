// @flow
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const form = css({
  background: colors.background,
  padding: `${variables.gap.small * 1.5}px ${variables.gap.small * 1.5}px ${variables.gap.big}px`,
  boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
});

export const formHeading = css({
  fontSize: '1.125rem',
  fontWeight: 'bold',
  margin: `0 0 ${variables.gap.small}px`,
});

export const fieldset = css({
  padding: 0,
  margin: `0 0 ${variables.gap.big}px`,
  border: 0,
});

export const formField = css({
  width: '100%',
  paddingBottom: variables.gap.small,
});

export const pickerSwitch = css({
  marginTop: '-1rem',
});

export const pickerItem = css({
  paddingRight: variables.gap.xbig,
  ':last-of-type': {
    paddingRight: 0,
  },
}).toString();

export const button = css({
  width: '100%',
}).toString();
