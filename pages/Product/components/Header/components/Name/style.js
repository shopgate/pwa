import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const name = css({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.25',
  marginBottom: 2,
  marginRight: 72,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    wordBreak: 'keep-all',
    hyphens: 'none',
  },
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
