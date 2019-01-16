import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import { APP_BAR_DEFAULT } from '@shopgate/pwa-common/constants/Portals';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
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
    const { __ } = this.context.i18n();
    const title = __(this.props.title || '');

    const left = <AppBar.Icon icon={BurgerIcon} onClick={NavDrawer.open} testId="Button" />;
    const center = <AppBar.Title title={title} />;
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

    return (
      <Portal name={APP_BAR_DEFAULT}>
        <AppBar left={left} center={center} right={right} {...this.props} below={below} />
      </Portal>
    );
  }
}

export default AppBarDefault;
