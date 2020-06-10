import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { styles as formStyles } from '../../../checkout/components/Form';

const { variables } = themeConfig;

export const container = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  display: 'flex',
  flex: '0 0 auto',
  flexDirection: 'column',
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    width: '50%',
  },
});

export const form = css({
  ...formStyles,
});

export const submitButton = css({
  width: '100%',
}).toString();

export const loginLink = css({
  color: 'var(--color-primary)',
  ':hover': {
    textDecoration: 'underline',
  },
}).toString();

export const messageBarContainer = css({
  margin: 0,
}).toString();
