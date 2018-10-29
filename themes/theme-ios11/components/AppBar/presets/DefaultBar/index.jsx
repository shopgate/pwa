import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-ios';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    below: PropTypes.node,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    below: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { title } = this.props;
    const { __ } = this.context.i18n();
    const center = <AppBar.Title title={__(title || '')} />;

    const below = (
      <Fragment>
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return <AppBar center={center} {...this.props} below={below} />;
  }
}

export default AppBarDefault;
