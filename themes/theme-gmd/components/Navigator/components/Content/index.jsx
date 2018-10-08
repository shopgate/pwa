import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Logo from './components/Logo';
import Title from './components/Title';
import Search from './components/Search';
import Suggestions from './components/Suggestions';

/**
 * The NavigatorContent component.
 */
class NavigatorContent extends PureComponent {
  static propTypes = {
    routePattern: PropTypes.string,
  };

  static defaultProps = {
    routePattern: null,
  };

  /**
   * @return {boolean}
   */
  get isIndexRoute() {
    return this.props.routePattern === INDEX_PATH;
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        {this.isIndexRoute && <Logo />}
        {!this.isIndexRoute && <Title />}
        <Search />
        <Suggestions />
      </Fragment>
    );
  }
}

export default NavigatorContent;
