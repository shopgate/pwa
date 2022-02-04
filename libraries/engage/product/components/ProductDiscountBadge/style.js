import { css } from 'glamor';

const styles = {
  portal: css({
    top: 12,
  }).toString(),
  container: css({
    minWidth: 65,
    zIndex: 10,
  }),
  badge: css({
    fontSize: '1.15rem',
  }).toString(),
};

export default styles;
