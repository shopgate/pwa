import { css } from 'glamor';

const fullSize = {
  width: '100%',
  height: '100vh',
};

const container = css({
  ...fullSize,
  overflow: 'hidden',
  position: 'relative',
}).toString();

const zoomPanWrapper = css({
  ...fullSize,
  position: 'absolute',
}).toString();

const contentWrapper = css({
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}).toString();

export default {
  container,
  zoomPanWrapper,
  contentWrapper,
};
