import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

export default css({
  position: 'absolute',
  top: 0,
  right: 16,
  left: 'auto',
  transform: 'translate3d(0, -50%, 0)',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'none',
  },
});
