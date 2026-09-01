import React from 'react';
import { useTheme } from '@shopgate/engage/styles';
import { ViewContext } from '../../context';

/**
 * @returns {JSX}
 */
function ViewBelow() {
  const theme = useTheme();
  return (
    <ViewContext.Consumer>
      {({ bottom }) => {
        if (!bottom) {
          return null;
        }

        const styles = {
          flexShrink: 0,
          height: `calc(${bottom}px + ${theme.layout.safeArea.bottom})`,
        };

        return <div aria-hidden style={styles} className="engage__view__below" />;
      }}
    </ViewContext.Consumer>
  );
}

export default ViewBelow;

