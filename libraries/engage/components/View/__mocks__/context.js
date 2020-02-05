const context = {
  top: 20,
  bottom: 40,
  ariaHidden: false,
  set: jest.fn(),
  setTop: jest.fn(),
  setBottom: jest.fn(),
  setContentRef: jest.fn(),
  getContentRef: jest.fn(),
  scrollTop: jest.fn(),
  setAriaHidden: jest.fn(),
};

export const ViewContext = ({
  Consumer(props) {
    return props.children(context);
  },
});
