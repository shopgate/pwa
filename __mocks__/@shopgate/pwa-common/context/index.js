const context = {
  params: {
    categoryId: '1234',
    productId: '1234',
  },
  query: {
    s: 'abc',
  },
  state: {},
  pathname: '',
  pattern: '',
  id: '',
  visible: true,
  open: true,
};

export const RouteContext = ({
  Consumer(props) {
    return props.children(context);
  },
});

export const FormContext = ({
  Provider(props) {
    return props.children;
  },
});
