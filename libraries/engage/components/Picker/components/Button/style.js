import { css } from 'glamor';

const button = css({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '10px 20px',
}).toString();

const label = css({
  display: 'block',
}).toString();

const value = css({
  display: 'block',
  fontWeight: 'bold',
}).toString();

export default {
  button,
  label,
  value,
};
