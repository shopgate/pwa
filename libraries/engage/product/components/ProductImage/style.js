import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { shadows } = themeConfig;

const placeholderContainer = css({
  position: 'relative',
  width: '100%',
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop: '100%',
  },
}).toString();

const placeholderContent = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  textAlign: 'center',
}).toString();

const placeholderIconScale = 0.65;

const placeholder = css({
  position: 'absolute',
  width: `${placeholderIconScale * 100}% !important`,
  height: `${placeholderIconScale * 100}% !important`,
  top: `${(1.0 - placeholderIconScale) * 50}%`,
  left: `${(1.0 - placeholderIconScale) * 50}%`,
  color: 'rgba(0, 0, 0, .05)',
}).toString();

const innerShadow = css({
  position: 'relative',
  overflow: 'hidden',
  ':after': {
    display: 'block',
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: shadows.productImage,
    pointerEvents: 'none',
  },
}).toString();

export default {
  placeholderContainer,
  placeholderContent,
  placeholder,
  innerShadow,
};
