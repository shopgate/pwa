import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  AppBarAndroid as AppBar,
  NavDrawer,
  BurgerIcon,
  Portal,
} from '@shopgate/engage/components';
import {
  RouteContext,
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/engage/core';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
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

  state = {
    target: document.getElementById('AppHeader'),
  }

  /**
   * Sets the target if it hasn't been set before.
   */
  componentDidMount() {
    if (!this.state.target) {
      const target = document.getElementById('AppHeader');
      this.setState({ target: target || null }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.visible || !this.state.target) {
      return null;
    }

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

    return ReactDOM.createPortal(
      <Fragment>
        <Portal name={APP_BAR_DEFAULT_BEFORE} />
        <Portal name={APP_BAR_DEFAULT}>
          <AppBar left={left} center={center} right={right} {...this.props} below={below} />
        </Portal>
        <Portal name={APP_BAR_DEFAULT_AFTER} />
      </Fragment>,
      this.state.target
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible }) => <AppBarDefault {...props} visible={visible} />}
  </RouteContext.Consumer>
);

