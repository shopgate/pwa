const context = {
  top: 0,
  bottom: 0,
  set: jest.fn(),
  setTop: jest.fn(),
  setBottom: jest.fn(),
};

export const ViewContext = ({
  Consumer(props) {
    return props.children(context);
  },
});
