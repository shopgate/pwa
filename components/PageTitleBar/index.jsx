import React from 'react';
import { useRoute } from '@shopgate/engage/core';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { container } from './style';

/**
 * @returns {JSX}
 */
const PageTitleBar = () => {
  const { state, query } = useRoute();
  const { title = '' } = state;
  const { s: search } = query;

  if (!title) {
    return null;
  }

  return (
    <ResponsiveContainer breakpoint=">xs" webOnly>
      <div className={container}>
        { search || title }
      </div>
    </ResponsiveContainer>
  );
};

export default PageTitleBar;
