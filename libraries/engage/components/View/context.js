import React from 'react';
import noop from 'lodash/noop';

export const ViewContext = React.createContext({
  top: null,
  bottom: null,
  ariaHidden: false,
  set: noop,
  setTop: noop,
  setBottom: noop,
  setContentRef: noop,
  getContentRef: () => ({ current: null }),
  scrollTop: noop,
  setAriaHidden: noop,
});
