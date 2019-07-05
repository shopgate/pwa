import { css } from 'glamor';

export default css({
  position: 'relative',
  height: 0,
  overflow: 'hidden',
  padding: '56.25% 0 0 0',
  ' iframe, object, embed': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
}).toString();
