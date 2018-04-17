import { css } from 'glamor';

const container = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

export default {
  container,
};
