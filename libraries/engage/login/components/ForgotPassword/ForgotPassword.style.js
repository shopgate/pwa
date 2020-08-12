import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { StylePresets } from '@shopgate/engage/components/Form';

const { variables, colors } = themeConfig;

export const container = css({
  flexGrow: 1,
  padding: `${variables.gap.small * 3}px ${variables.gap.big}px`,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    width: '50%',
  },
});

export const headline = css({
  fontSize: '2.1875rem',
  lineHeight: 1,
  fontWeight: 500,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    fontSize: '2rem',
    fontWeight: 'normal',
    paddingBottom: variables.gap.big,
  },
});

export const subline = css({
  fontSize: '1.125rem',
  color: `var(--color-text-low-emphasis, ${colors.shade6})`,
  marginBottom: variables.gap.big,
  marginTop: 4,
});

export const form = css({
  paddingTop: 24,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ' .simpleInput': {
      paddingLeft: variables.gap.big,
    },
  },
});

export const buttonContainer = css({
  paddingTop: variables.gap.big * 2,
  paddingBottom: variables.gap.big * 1.5,
}).toString();

export const button = css({
  width: '100%',
}).toString();

export const input = css({
  ' .label': {
    color: 'var(--color-text-low-emphasis)',
  },
  ' .placeholder': {
    color: 'var(--color-text-low-emphasis)',
  },
  ' .simpleInput': {
    color: 'var(--color-text-heigh-emphasis)',
  },
}).toString();

export const resetInstructions = css({
  paddingTop: variables.gap.big,
  display: 'flex',
  alignItems: 'center',
});

export const resetInstructionsEmail = css({
  fontWeight: 'bold',
  color: 'var(--color-secondary)',
});

export const goBackButtonContainer = css({
  padding: `${variables.gap.big}px 0`,
}).toString();

export const goBackButton = css({
  fontSize: '0.875rem !important',
  padding: '0 !important',
  ' > div ': {
    padding: 0,
    display: 'flex',
  },
}).toString();

export const goBackButtonIcon = css({
  display: 'inline-block',
  fontSize: '1.375rem !important',
  alignSelf: 'center',
  marginRight: variables.gap.xsmall,
  marginLeft: -3,
  marginTop: -2,
}).toString();
