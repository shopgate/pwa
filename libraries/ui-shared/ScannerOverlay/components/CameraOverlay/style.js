import { css } from 'glamor';
import { themeVariables, themeColors } from '@shopgate/pwa-common/helpers/config';

const edgeHeight = 45;
const edgeWidth = 35;
const edgeBorderWidth = 3;
const edgeOffsetHorizontal = themeVariables.gap.xbig;
const edgeOffsetVertical = themeVariables.gap.xxbig;

export default css({
  position: 'relative',
  height: '90%',
  width: '100%',
  ':before,:after,>:before,>:after': {
    display: 'block',
    content: ' ',
    width: edgeWidth,
    height: edgeHeight,
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: themeColors.light,
  },
  ':before': {
    top: edgeOffsetVertical,
    left: edgeOffsetHorizontal,
    borderWidth: `${edgeBorderWidth}px 0 0 ${edgeBorderWidth}px`,
  },
  ':after': {
    top: edgeOffsetVertical,
    right: edgeOffsetHorizontal,
    borderWidth: `${edgeBorderWidth}px ${edgeBorderWidth}px 0 0`,
  },
  '>:before': {
    bottom: edgeOffsetVertical,
    left: edgeOffsetHorizontal,
    borderWidth: `0 0 ${edgeBorderWidth}px ${edgeBorderWidth}px`,
  },
  '>:after': {
    bottom: edgeOffsetVertical,
    right: edgeOffsetHorizontal,
    borderWidth: `0 ${edgeBorderWidth}px ${edgeBorderWidth}px 0`,
  },
}).toString();
