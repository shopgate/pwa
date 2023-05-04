import React from 'react';

// eslint-disable-next-line require-jsdoc
export const usePrevious = (value) => {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
