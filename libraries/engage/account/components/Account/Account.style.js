import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { variables } = themeConfig;

export const title = css({
  fontSize: '1.5rem',
  padding: variables.gap.big,
}).toString();

export const tabs = css({
  width: '100%',
  top: 0,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    top: 64,
  },
  [responsiveMediaQuery('<=xs', { webOnly: true })]: {
    top: 56,
  },
  position: 'sticky',
  background: 'rgb(255, 255, 255)',
  boxShadow: '2px 1px 6px rgba(0, 0, 0, 0.118), 2px 1px 4px rgba(0, 0, 0, 0.118)',
  zIndex: 100,
}).toString();

export const tabPanel = css({
  padding: variables.gap.small,
}).toString();
