import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const placeholder = css({
  height: 20,
  width: '50px',
  display: 'inline-block',
}).toString();

const price = css({
  fontSize: '1.25rem',
  justifyContent: 'flex-end',
  lineHeight: 1,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    justifyContent: 'flex-start',
  },
}).toString();

export default {
  placeholder,
  price,
};
