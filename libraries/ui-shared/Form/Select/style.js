import { css } from 'glamor';

const select = css({
  appearance: 'none',
  position: 'relative',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  padding: 0,
  width: '100%',
  margin: '24px 0 0 0',
  outline: 0,
  fontSize: 16,
  lineHeight: '19px',
}).toString();

export default {
  select,
};
