import React from 'react';
import { ViewContext } from '../../context';

/**
 * @returns {JSX}
 */
function ViewAbove() {
  return (
    <ViewContext.Consumer>
      {({ top }) => {
        if (!top) {
          return null;
        }

        const styles = {
          flexShrink: 0,
          height: `calc(${top}px + var(--safe-area-inset-top))`,
        };

        return <div aria-hidden style={styles} />;
      }}
    </ViewContext.Consumer>
  );
}

export default ViewAbove;

