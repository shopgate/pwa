import { css } from 'glamor';

export default css({
  // prevent two consecutive dividers
  ' + hr': {
    display: 'none',
  },
  background: '#eaeaea',
  border: 0,
  height: 1,
  margin: '16px 0',
});
