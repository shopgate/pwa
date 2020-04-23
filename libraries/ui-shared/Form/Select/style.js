import { css } from 'glamor';

const select = css({
  appearance: 'none',
  position: 'relative',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  padding: '0 20px 0 0',
  width: '100%',
  margin: '24px 0 0 0',
  outline: 0,
  fontSize: 16,
  lineHeight: '19px',
}).toString();

const chevron = css({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%) rotateZ(-90deg)',
  fontSize: '1.3em !important',
  marginTop: -3,
}).toString();

export default {
  select,
  chevron,
};
