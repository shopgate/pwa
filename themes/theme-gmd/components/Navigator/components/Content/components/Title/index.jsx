import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ACTION_POP } from '@virtuous/conductor/constants';
import getCurrentAction from '@virtuous/conductor-helpers/getCurrentAction';
import { UIEvents } from '@shopgate/pwa-core';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';
import { TOGGLE_NAVIGATOR_TITLE } from '../../../../constants';

/**
 * The NavigatorTitle component.
 */
class NavigatorTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.previousTitle = '';
    this.title = props.title;
    this.state = {
      visible: true,
    };

    UIEvents.on(TOGGLE_NAVIGATOR_TITLE, this.toggle);
  }

  /**
   * When the component receives new props, preserve the current title.
   * @param {Object} nextProps The components next props.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.title !== '' && nextProps.title !== this.title) {
      this.previousTitle = this.title;
      this.title = nextProps.title;
    }
  }

  /**
   * Determine how the views should be displayed.
   * @returns {JSX}
   */
  get transitionClass() {
    // For the first page don't do any animation.
    if (!this.previousTitle) {
      return {
        inactive: '',
        active: '',
      };
    }

    const pop = getCurrentAction() === ACTION_POP;

    return {
      inactive: pop ? styles.centerToRight : styles.centerToLeft,
      active: pop ? styles.leftToCenter : styles.rightToCenter,
    };
  }

  /**
   * @param {boolean} visible The next visibility state.
   */
  toggle = (visible) => {
    this.setState({ visible });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const transition = this.transitionClass;

    if (!this.state.visible) {
      return null;
    }

    return (
      <div aria-hidden onClick={this.props.onClick}>
        {/* Renders the inactive / previous title */}
        <div className={`${styles.title} ${transition.inactive}`}>
          <I18n.Text string={this.previousTitle} />
        </div>

        {/* Renders the active / current title */}
        <div className={`${styles.title} ${transition.active}`} data-test-id={`title: ${this.props.title}`}>
          <I18n.Text string={this.props.title} />
        </div>
      </div>
    );
  }
}

export default connect(NavigatorTitle);
