import React from 'react';
import { ViewContext } from '../../context';

/**
 * @returns {JSX}
 */
function ViewBelow() {
  return (
    <ViewContext.Consumer>
      {({ bottom }) => {
        if (!bottom) {
          return null;
        }

        const styles = {
          flexShrink: 0,
          height: `calc(${bottom}px + var(--safe-area-inset-bottom))`,
        };

        return <div aria-hidden style={styles} />;
      }}
    </ViewContext.Consumer>
  );
}

export default ViewBelow;

