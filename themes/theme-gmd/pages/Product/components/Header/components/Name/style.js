import { css } from 'glamor';

const name = css({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.25',
  marginBottom: 2,
  marginRight: 72,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const placeholder = css({
  width: '70%',
  height: 24,
  marginTop: 5,
}).toString();

export default {
  name,
  placeholder,
};
