import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const styles = {
  portal: css({
    top: 12,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      top: 25,
      left: 25,
    },
  }).toString(),
  container: css({
    minWidth: 65,
    zIndex: 10,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      minWidth: 50,
    },
  }),
  badge: css({
    fontSize: '1.15rem',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: 14,
    },
  }).toString(),
};

export default styles;
