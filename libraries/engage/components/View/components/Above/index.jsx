import React from 'react';
import { useTheme } from '@shopgate/engage/styles';
import { ViewContext } from '../../context';

/**
 * @returns {JSX}
 */
function ViewAbove() {
  const theme = useTheme();
  return (
    <ViewContext.Consumer>
      {({ top }) => {
        if (!top) {
          return null;
        }

        const styles = {
          flexShrink: 0,
          height: `calc(${top}px + ${theme.layout.safeArea.top})`,
        };

        return <div aria-hidden style={styles} className="engage__view__above" />;
      }}
    </ViewContext.Consumer>
  );
}

export default ViewAbove;

