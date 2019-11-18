export default {
  entering: {
    transform: 'translate3d(0, 0, 0)',
    visibility: 'visible',
  },
  entered: {
    transform: 'translate3d(0, 0, 0)',
    visibility: 'visible',
  },
  exiting: {
    boxShadow: 'none',
    transform: 'translate3d(-100%, 0, 0)',
    visibility: 'visible',
  },
  exited: {
    boxShadow: 'none',
    transform: 'translate3d(-100%, 0, 0)',
    visibility: 'hidden',
  },
};
