import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme } from '@shopgate/engage/core';
import { StylePresets } from '@shopgate/engage/components/Form';

const { variables } = themeConfig;

export const container = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  '@media(min-width: 768px)': {
    flexDirection: 'row-reverse',
    '> :not(:first-child)': {
      marginRight: variables.gap.big,
    },
  },
});

export const containerItem = css({
  flexGrow: 1,
  flexShrink: 0,
  '@media(min-width: 768px)': {
    width: `calc(50% - ${variables.gap.big}px)`,
  },
});

export const form = css({
  ...StylePresets.OUTLINED_FORM_FIELDS,
  ' .registrationOptInMarketingOptIn': {
    ' .checkbox': {
      ...(isIOSTheme() ? {
        paddingBottom: 0,
      } : {}),
    },
    ...(!isIOSTheme() ? {
      paddingTop: 0,
      paddingBottom: variables.gap.big,
    } : {}),
  },
});

export const section = css({
//  marginBottom: variables.gap.big * 1.5,
}).toString();

export const submitButtonContainer = css({
  margin: `0 ${variables.gap.big}px ${variables.gap.big}px`,
  '@media(min-width: 768px)': {
    width: `calc(50% - ${variables.gap.big}px)`,
  },
});

export const submitButton = css({
  width: '100%',
}).toString();
