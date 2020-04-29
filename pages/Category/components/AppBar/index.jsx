import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import Bar from '../Bar';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ hasChildren, hasProducts, title }) {
  /**
   * @returns {JSX}
   */
  const BarComponent = () => (
    <DefaultBar
      title={title}
      below={<Bar hasChildren={hasChildren} hasProducts={hasProducts} />}
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
  hasChildren: PropTypes.bool.isRequired,
  hasProducts: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

CategoryAppBar.defaultProps = {
  title: '',
};

export default connect(CategoryAppBar);
