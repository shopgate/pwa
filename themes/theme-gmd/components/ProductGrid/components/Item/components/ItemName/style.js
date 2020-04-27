import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export default css({
  fontWeight: '500',
  lineHeight: 1.15,
  marginTop: 1,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    fontSize: '1.125rem',
    marginTop: 8,
  },
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    fontSize: '1.25rem',
    marginTop: 8,
  },
});
