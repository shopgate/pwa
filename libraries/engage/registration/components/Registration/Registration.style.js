import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  '@media(min-width: 768px)': {
    flexDirection: 'row',
    '> :not(:last-child)': {
      marginRight: variables.gap.big,
    },
  },
});

export const containerItem = css({
  flexGrow: 1,
  flexShrink: 0,
});

export const form = css({
  ' .textField': {
    // paddingBottom: variables.gap.small,
  },
  ' .phonePicker': {
    paddingTop: variables.gap.big,
    paddingBottom: variables.gap.small,
  },
  ' .placeholder': {
    color: colors.shade12,
  },
});

export const section = css({
  marginBottom: variables.gap.big * 1.5,
}).toString();

export const submitButton = css({
  margin: `0 ${variables.gap.big}px max(${variables.gap.big}px, var(--safe-area-inset-bottom)) ${variables.gap.big}px`,
}).toString();
