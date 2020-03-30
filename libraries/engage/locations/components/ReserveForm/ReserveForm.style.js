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

export const phoneField = css({
  position: 'relative',
  width: '100%',
  paddingTop: variables.gap.big * 0.75,
  paddingBottom: variables.gap.big * 1.25,
  marginBottom: variables.gap.small,
  ' input.PhoneInputInput': {
    outline: 'none',
    fontSize: '1rem',
    lineHeight: '1.1875rem',
    borderRadius: 0,
    paddingBottom: variables.gap.xsmall * 1.5,
    borderBottom: `1px solid ${colors.shade12}`,
    '&:focus': {
      borderBottom: `2px solid ${colors.primary}`,
      paddingBottom: (variables.gap.xsmall * 1.5) - 1,
    },
  },
});

export const phoneFieldError = css({
  ' input.PhoneInputInput': {
    borderBottom: `2px solid ${colors.error} !important`,
    paddingBottom: (variables.gap.xsmall * 1.5) - 1,
  },
});

export const phoneFieldErrorText = css({
  position: 'absolute',
  width: '100%',
  bottom: 2,
  fontSize: '0.75rem',
  lineHeight: 0.875,
  color: colors.error,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
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

export const progressBar = css({
  height: '4px',
  position: 'relative',
});
