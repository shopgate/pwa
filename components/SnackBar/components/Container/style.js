import { css } from 'glamor';

const container = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  wordBreak: 'keep-all',
  hyphens: 'auto',
}).toString();

export default {
  container,
};
