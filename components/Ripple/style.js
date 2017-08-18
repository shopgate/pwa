import cxs from 'cxs';

const ripple = cxs({
  position: 'absolute',
  borderRadius: '50%',
  transformOrigin: '50% 50% 0',
});

const container = cxs({
  position: 'absolute',
  zIndex: 0,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

export default {
  ripple,
  container,
};
