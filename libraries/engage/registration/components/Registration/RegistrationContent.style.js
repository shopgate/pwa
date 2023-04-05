import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { StylePresets } from '@shopgate/engage/components/Form';
import { isIOSTheme } from '@shopgate/engage/core';

const { variables } = themeConfig;

export const container = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  ...(!isIOSTheme() ? {
    '@media(min-width: 768px)': {
      flexDirection: 'row-reverse',
      '> :not(:first-child)': {
        marginRight: variables.gap.big,
      },
    },
  } : null),
});

export const containerItem = css({
  flexGrow: 1,
  flexShrink: 0,
  ...(!isIOSTheme() ? {
    '@media(min-width: 768px)': {
      width: `calc(50% - ${variables.gap.big}px)`,
    },
  } : null),

});

export const form = css({
  ...StylePresets.OUTLINED_FORM_FIELDS,
  ' .registrationOptInMarketingOptIn': {
    paddingTop: 0,
    paddingBottom: variables.gap.big,
  },
});

export const section = css({
//  marginBottom: variables.gap.big * 1.5,
}).toString();

export const shippingFormSection = css({
  paddingBottom: 32,
}).toString();

export const hidden = css({
  display: 'none',
}).toString();

export const submitButtonContainer = css({
  margin: `0 ${variables.gap.big}px ${variables.gap.big}px`,
  ...(!isIOSTheme() ? {
    '@media(min-width: 768px)': {
      width: `calc(50% - ${variables.gap.big}px)`,
    },
  } : null),
});

export const submitButton = css({
  width: '100%',
  marginTop: 8,
}).toString();
