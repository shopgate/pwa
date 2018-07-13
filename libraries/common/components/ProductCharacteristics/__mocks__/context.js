import React from 'react';

export const defaultContext = {
  highlight: null,
  characteristics: {},
};
let context;

export const VariantContext = ({
  Provider(props) {
    /* eslint-disable react/prop-types */
    context = props.value || defaultContext;
    return React.createElement('div', null, props.children);
    /* eslint-enable react/prop-types */
  },
  Consumer(props) {
    return props.children(context || defaultContext);
  },
});
