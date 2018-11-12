export default {
  push: {
    in: {
      from: { x: window.innerWidth },
      to: { x: 0 },
    },
    out: {
      from: { x: 0 },
      to: { x: -window.innerWidth },
    },
  },
  pop: {
    in: {
      from: { x: -window.innerWidth },
      to: { x: 0 },
    },
    out: {
      from: { x: 0 },
      to: { x: window.innerWidth },
    },
  },
  replace: {
    in: {
      from: { y: window.innerHeight },
      to: { y: 0 },
    },
    out: {
      from: { y: 0 },
      to: { y: 0 },
    },
  },
};
