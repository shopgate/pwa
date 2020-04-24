import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export default css({
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  overflowScrolling: 'touch',
  position: 'absolute',
  top: 0,
  WebkitOverflowScrolling: 'touch',
  width: '100vw',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    transform: 'translateX(-50%)',
    left: '50%',
    width: 'var(--page-content-width)',
    backgroundColor: 'var(--page-background-color)',
  },
});
