import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const container = css({
  margin: `${variables.gap.big}px`,
}).toString();

const ratingScale = css({
  marginBottom: variables.gap.big,
});

export default {
  container,
  ratingScale,
};
