import { isIOSTheme } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/engage';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors, variables } = themeConfig;

export const TWO_COLUMN_LAYOUT = {
  [responsiveMediaQuery('>=md', { webOnly: false })]: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
    marginTop: 16,
    marginBottom: 8,
    '>div': {
      flex: '1 1 50%',
      padding: '0 8px',
      maxWidth: '50%',
    },
    '>.phonePicker': {
      marginLeft: 8,
      marginRight: 8,
      flexBasis: 'calc(50% - 16px)',
    },
  },
};

export const OUTLINED_FORM_FIELDS = {
  ' .textField, .formElement:not(.radioGroup):not(.checkbox), .phonePicker': {
    paddingBottom: 8,
    ...(!isIOSTheme() ? {
      background: `var(--color-background-accent, ${colors.shade8})`,
      padding: 0,
      marginBottom: 32,
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
      transform: 'translate3d(0, -18px, 0) scale3d(0.75, 0.75, 0.75)',
    } : {}),
  },
  ' .textField label': {
    ...(!isIOSTheme() ? {
      paddingLeft: 17,
      color: 'var(--color-text-low-emphasis)',
      '.floating': {
        transform: 'translate3d(3px, -18px, 0) scale3d(0.75, 0.75, 0.75)',
      },
    } : {}),
  },
  ' .formElement:not(.radioGroup) select': {
    ...(!isIOSTheme() ? {
      paddingLeft: 16,
      color: 'var(--color-text-high-emphasis)',
    } : {}),
  },
  ' .formElement:not(.radioGroup):not(.checkbox) svg': {
    ...(!isIOSTheme() ? {
      marginTop: 8,
      right: 8,
    } : {}),
  },
  ' .formElement:not(.radioGroup) .placeholder': {
    ...(!isIOSTheme() ? {
      paddingLeft: 20,
      color: 'var(--color-text-low-emphasis)',
    } : {}),
  },
  ' .formElement.disabled, .textField.disabled': {
    ' input, select, svg': {
      opacity: 0.28,
    },
    ' .label': {
      opacity: 0.6,
    },
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
