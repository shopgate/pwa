import { css } from 'glamor';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { gap } = themeVariables;

export const root = css({
  padding: gap.big,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'stretch',
  alignItems: 'baseline',
  flex: 1,
}).toString();

export const checkbox = css({
  marginLeft: 8,
}).toString();

export const text = css({
  flexGrow: 0,
}).toString();

export const rightSpace = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'baseline',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    flex: 0,
  },
}).toString();

export const leftSpace = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'baseline',
}).toString();
