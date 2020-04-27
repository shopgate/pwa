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

export const itemPriceLink = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    paddingTop: variables.gap.small,
    marginTop: 'auto',
    ' ul > li': {
      flexGrow: 'inherit',
      ':first-child': {
        marginRight: variables.gap.big,
      },
    },
  },
}).toString();
