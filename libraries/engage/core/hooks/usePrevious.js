import React from 'react';

// eslint-disable-next-line require-jsdoc
export function usePrevious(value) {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
