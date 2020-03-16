import { css } from 'glamor';
import { themeShadows, themeColors } from '@shopgate/pwa-common/helpers/config';

export const placeholderContainer = css({
  position: 'relative',
  width: '100%',
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop: '100%',
  },
}).toString();

export const placeholderContent = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  textAlign: 'center',
}).toString();

const placeholderIconScale = 0.65;

export const placeholderIcon = css({
  position: 'absolute',
  width: `${placeholderIconScale * 100}% !important`,
  height: `${placeholderIconScale * 100}% !important`,
  top: `${(1.0 - placeholderIconScale) * 50}%`,
  left: `${(1.0 - placeholderIconScale) * 50}%`,
  color: themeColors.placeholder,
}).toString();

export const innerShadow = css({
  ':after': {
    display: 'block',
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: themeShadows.productImage,
    pointerEvents: 'none',
  },
}).toString();
