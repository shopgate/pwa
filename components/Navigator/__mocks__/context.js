import React from 'react';

const context = {
  searchField: false,
  toggleSearchField: jest.fn(),
  searchQuery: '',
  setSearchQuery: jest.fn(),
};

export const NavigatorContext = ({
  Provider(props) {
    /* eslint-disable-next-line react/prop-types */
    return React.createElement('div', props, props.children);
  },
  Consumer(props) {
    return props.children(context);
  },
});
