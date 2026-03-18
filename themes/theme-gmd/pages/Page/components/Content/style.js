import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const widgetWrapper = css({
  background: 'var(--page-background-color)',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    paddingBottom: 16,
  },
}).toString();

export default {
  widgetWrapper,
};
