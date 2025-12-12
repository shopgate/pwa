import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import PageTitleBar from 'Components/PageTitleBar';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ filtersShown, title }) {
  const bar = useMemo(() => (
    <DefaultBar
      title={title}
      below={<PageTitleBar />}
      shadow={!filtersShown}
    />
  ), [title, filtersShown]);

  return (
    <>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        {bar}
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        {bar}
      </ResponsiveContainer>
    </>
  );
}

CategoryAppBar.propTypes = {
  filtersShown: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

CategoryAppBar.defaultProps = {
  title: '',
};

export default connect(CategoryAppBar);
