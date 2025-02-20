import { css } from 'glamor';
import { themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  padding: '0 12px 8px 12px',
  background: themeColors.light,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridTemplateRows: 'auto',
  gridTemplateAreas: `
    "countries input"
    "radius radius"
  `,
});

export const countriesCell = css({
  gridArea: 'countries',
  maxWidth: 160,
  paddingRight: themeVariables.gap.small,
});

export const inputCell = css({
  gridArea: 'input',
});

export const radiusCell = css({
  gridArea: 'radius',
  ':not(:empty)': {
    height: 38,
    marginTop: themeVariables.gap.small,
  },
});

export const selectContainer = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
  height: '100%',
  '&:after': {
    zIndex: 2,
    content: '""',
    position: 'absolute',
    display: 'block',
    top: '50%',
    right: themeVariables.gap.small * 1.5,
    transform: 'translate3d(0, -25%, 0)',
    width: 5,
    height: 5,
    border: '5px solid transparent',
    borderTopColor: themeColors.shade6,
  },
});

export const select = css({
  appearance: 'none',
  border: `1px solid ${themeColors.shade7}`,
  padding: `0 ${themeVariables.gap.bigger + themeVariables.gap.small * 1.5}px 0 ${themeVariables.gap.big * 0.75}px`,
  color: themeColors.shade11,
  fontSize: '1rem',
  borderRadius: 4,
  width: '100%',
  outline: 0,
});

export const inputContainer = css({
  background: themeColors.light,
  border: `1px solid ${themeColors.shade7}`,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const input = css({
  margin: '3px 0',
  width: '100%',
  lineHeight: '28px',
  outline: 'none',
  verticalAlign: 'middle',
  WebkitAppearance: 'none',
});

export const inputIcon = css({
  padding: 0,
  margin: '0 8px',
  color: themeColors.shade9,
  fontSize: '1.23rem',
  flexShrink: 0,
  outline: 0,
});

export const iconClass = css({
  fontSize: '1.25rem !important',
}).toString();
