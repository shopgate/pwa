import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { RouteContext } from '@shopgate/pwa-common/context';
import ProgressBar from './components/ProgressBar';

const target = document.getElementById('AppHeader');

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

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.visible) {
      return null;
    }

    const { title } = this.props;
    const { __ } = this.context.i18n();
    const center = <AppBar.Title title={__(title || '')} key="center" />;

    const below = (
      <Fragment key="below">
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return ReactDOM.createPortal(
      <AppBar center={center} {...this.props} below={below} />,
      target
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible }) => <AppBarDefault {...props} visible={visible} />}
  </RouteContext.Consumer>
);
