import { css } from 'glamor';

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

export default {
  placeholderContainer,
  placeholderContent,
  placeholder,
};
