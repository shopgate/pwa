import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const ctaButtonWrapper = css({
  marginTop: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}).toString();

const cartButton = css({
  marginLeft: 22,
  marginRight: variables.gap.big,
}).toString();

export default {
  cartButton,
  ctaButtonWrapper,
};
