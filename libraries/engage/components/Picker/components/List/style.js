import { css } from 'glamor';

const button = css({
  display: 'block',
  width: '100%',
  padding: '10px 20px',
  outline: 'none',
  textAlign: 'left',
}).toString();

const active = css({
  button: {
    fontWeight: 'bold',
  },
}).toString();

export default {
  button,
  active,
};
