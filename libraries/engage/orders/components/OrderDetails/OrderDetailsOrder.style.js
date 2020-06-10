import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const root = css({
  padding: `${variables.gap.big}px 0`,
});

export const contactsWrapper = css({
  paddingBottom: variables.gap.big,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    display: 'flex',
  },
}).toString();

export const contact = css({
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: variables.gap.small,
    paddingRight: variables.gap.small,
    ':first-child': {
      paddingLeft: variables.gap.big,
    },
    ':last-child': {
      paddingRight: variables.gap.big,
    },
  },
}).toString();

export const cartWrapper = css({
  paddingTop: variables.gap.big,
  paddingBottom: variables.gap.big,
});

export const summaryWrapper = css({
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
});

export const summary = css({
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    width: '50%',
  },
}).toString();

export const supplemental = css({
  padding: variables.gap.big,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    width: '50%',
  },
}).toString();
