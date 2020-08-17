import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import PageTitleBar from 'Components/PageTitleBar';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ title }) {
  /**
   * @returns {JSX}
   */
  const BarComponent = () => (
    <DefaultBar
      title={title}
      below={<PageTitleBar />}
    />
  );

  return (
    <Fragment>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        <BarComponent />
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <BarComponent />
      </ResponsiveContainer>
    </Fragment>
  );
}

CategoryAppBar.propTypes = {
  title: PropTypes.string,
};

CategoryAppBar.defaultProps = {
  title: '',
};

export default connect(CategoryAppBar);
