import { isIOSTheme } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';

const { colors, variables } = themeConfig;

const formStyles = {
  ' .textField, .formElement:not(.radioGroup), .phonePicker': {
    paddingBottom: 8,
    ...(!isIOSTheme() ? {
      background: `var(--color-background-accent, ${colors.shade8})`,
      padding: 0,
      marginBottom: 38,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      borderBottom: `1px solid ${colors.shade12}`,
    } : {}),
  },
  ' .phonePickerError': {
    ...(!isIOSTheme() ? {
      borderBottom: `2px solid var(--color-state-alert, ${colors.error})`,
    } : {}),
  },
  ' .phonePickerFocused:not(.phonePickerError)': {
    ...(!isIOSTheme() ? {
      borderBottom: '2px solid var(--color-primary)',
    } : {}),
  },
  ' .formElement:not(.radioGroup) label': {
    ...(!isIOSTheme() ? {
      paddingLeft: 24,
      color: 'var(--color-text-low-emphasis)',
    } : {}),
  },
  ' .textField label': {
    ...(!isIOSTheme() ? {
      paddingLeft: 24,
      color: 'var(--color-text-low-emphasis)',
    } : {}),
  },
  ' .formElement:not(.radioGroup) select': {
    ...(!isIOSTheme() ? {
      paddingLeft: 16,
      color: 'var(--color-text-high-emphasis)',
    } : {}),
  },
  ' .formElement:not(.radioGroup) svg': {
    ...(!isIOSTheme() ? {
      marginTop: 8,
      right: 8,
    } : {}),
  },
  ' .formElement:not(.radioGroup) .placeholder': {
    ...(!isIOSTheme() ? {
      paddingLeft: 24,
      color: 'var(--color-text-low-emphasis)',
    } : {}),
  },
  ' .textField input': {
    ...(!isIOSTheme() ? {
      paddingLeft: 16,
      color: 'var(--color-text-high-emphasis)',
    } : {}),
  },
  ' .underline': {
    ...(!isIOSTheme() ? {
      marginBottom: 0,
      borderBottom: 'none',
    } : {}),
  },
  ' .errorText': {
    ...(!isIOSTheme() ? {
      bottom: -20,
      left: 24,
    } : {}),
  },
  ' .phonePicker': {
    paddingTop: variables.gap.big,
    ...(isIOSTheme() ? {
      paddingBottom: 2,
    } : {
      paddingTop: 23,
      paddingLeft: 8,
    }),
  },
  ' .phonePicker .PhoneInputInput': {
    ...(!isIOSTheme() ? {
      borderBottom: 'none',
      color: 'var(--color-text-high-emphasis)',
      '&:focus': {
        borderBottom: 'none',
      },
      '::placeholder': {
        color: 'var(--color-text-low-emphasis)',
      },
    } : {}),
  },
  ' .phonePicker .errorText': {
    ...(!isIOSTheme() ? {
      left: -16,
    } : {}),
  },
  ' .PhoneInputCountryIcon': {
    ...(!isIOSTheme() ? {
      marginBottom: 8,
      marginLeft: 16,
    } : {}),
  },
  ' .PhoneInputCountrySelectArrow': {
    ...(!isIOSTheme() ? {
      marginRight: 6,
      marginLeft: 10,
      marginBottom: 8,
    } : {}),
  },
  ' .placeholder': {
    color: colors.shade12,
  },
};

export default formStyles;
