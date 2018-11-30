import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import { RouteContext } from '@shopgate/pwa-common/context';
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

  target = document.getElementById('AppHeader');

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.visible) {
      return null;
    }

    const { title } = this.props;
    const { __ } = this.context.i18n();
    const left = <AppBar.Icon icon={BurgerIcon} onClick={NavDrawer.open} testId="Button" />;
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

    return ReactDOM.createPortal(
      <AppBar left={left} center={center} right={right} {...this.props} below={below} />,
      this.target
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible }) => <AppBarDefault {...props} visible={visible} />}
  </RouteContext.Consumer>
);
