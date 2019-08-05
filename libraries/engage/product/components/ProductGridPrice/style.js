import { css } from 'glamor';
import { themeName } from '@shopgate/pwa-common/helpers/config';

const isIOS = themeName.includes('ios');

const priceWrapper = css(isIOS ? {
  lineHeight: 1.75,
  marginTop: 2,
  alignItems: 'center',
} : {
  lineHeight: 1.75,
}).toString();

const basicPrice = css({
  fontSize: '0.85em',
  marginTop: -1,
}).toString();

const strikedPrice = css(isIOS ? {
  fontSize: '0.75rem',
} : {}).toString();

export default {
  basicPrice,
  priceWrapper,
  strikedPrice,
};
