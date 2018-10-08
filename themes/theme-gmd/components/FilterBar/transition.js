export default {
  entering: {
    transform: 'translate3d(0, 0, 0)',
  },
  entered: {
    transform: 'translate3d(0, 0, 0)',
  },
  exiting: {
    boxShadow: 'none',
    transform: 'translate3d(0, -100%, 0)',
  },
  exited: {
    boxShadow: 'none',
    transform: 'translate3d(0, -100%, 0)',
  },
};
