import { css } from 'glamor';
import { physicalPixelSize } from '@shopgate/pwa-common/helpers/style';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

export default css({
  marginBottom: 4,
  position: 'relative',
  ':after': {
    content: '""',
    position: 'absolute',
    right: variables.gap.big,
    bottom: -1,
    left: variables.gap.big,
    background: colors.dividers,
    ...physicalPixelSize('height', 1),
  },
}).toString();
