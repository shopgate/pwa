import React from 'react';

export const defaultContext = {
  searchField: false,
  toggleSearchField: jest.fn(),
  searchQuery: 'shirt',
  setSearchQuery: jest.fn(),
};
let context;

export const NavigatorContext = ({
  Provider(props) {
    /* eslint-disable react/prop-types */
    context = props.value || defaultContext;
    return React.createElement('div', props, props.children);
    /* eslint-enable react/prop-types */
  },
  Consumer(props) {
    return props.children(context || defaultContext);
  },
});
