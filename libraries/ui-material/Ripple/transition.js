export default {
  entering: {
    transition: 'transform 500ms cubic-bezier(0.39, 0.575, 0.565, 1)',
  },
  entered: {},
  exiting: {
    transition: 'opacity 500ms cubic-bezier(0.39, 0.575, 0.565, 1)',
  },
  exited: {
    opacity: 0,
    transform: ' scale3d(0, 0, 1)',
  },
};
