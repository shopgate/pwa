import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const halfGapBig = themeConfig.variables.gap.big / 2;

const containerBase = {
  textAlign: 'center',
};

const container = css({
  ...containerBase,
  margin: `${halfGapBig}px 0`,
}).toString();

const noGapContainer = css({
  ...containerBase,
}).toString();

const containerCircle = css({
  ...containerBase,
  margin: `${halfGapBig + 4}px 0`,
}).toString();

export default {
  container,
  containerCircle,
  noGapContainer,
};
