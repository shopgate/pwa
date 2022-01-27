import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const styles = {
  portal: css({
    top: 12,
  }).toString(),
  container: css({
    minWidth: 65,
    zIndex: 10,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      minWidth: 40,
    },
  }),
  badge: css({
    fontSize: '1.15rem',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: 'initial',
    },
  }).toString(),
};

export default styles;
