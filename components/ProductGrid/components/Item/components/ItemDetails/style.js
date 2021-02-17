import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const details = css({
  lineHeight: 1.35,
  ':not(:empty)': {
    padding: '12px 16px',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: variables.gap.big,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      ' > *:empty': {
        display: 'none',
      },
      ' > *:first-child[style*="display:none"] + *:not([style*="display:none"])': {
        paddingTop: 8,
      },
    },
  },
});

export const title = css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
});

export const itemNameLink = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    ' > *:not(:first-child) ': {
      paddingTop: 8,
    },
  },
}).toString();

export const propertiesLink = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ' > *:not([style*="display:none"])': {
      paddingTop: 8,
    },
  },
}).toString();

export const itemPrice = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    paddingTop: variables.gap.small,
    marginTop: 'auto',
    fontSize: '1.125rem',
    ' ul > li': {
      flexGrow: 'inherit',
      lineHeight: '1.5rem',
      ':first-child': {
        marginRight: variables.gap.big,
      },
    },
  },
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    fontSize: '1.25rem',
  },
}).toString();

export const quantityHint = css({
  paddingTop: 4,
}).toString();

