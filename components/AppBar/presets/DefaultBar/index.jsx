import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
  };

  static defaultProps = {
    title: null,
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
    const left = <AppBar.Icon icon={BurgerIcon} onClick={NavDrawer.open} />;
    const center = <AppBar.Title title={__(title || '')} />;
    const right = (
      <Fragment>
        <SearchButton />
        <CartButton />
      </Fragment>
    );
    const below = (
      <Fragment>
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return <AppBar left={left} center={center} right={right} {...this.props} below={below} />;
  }
}

export default AppBarDefault;
