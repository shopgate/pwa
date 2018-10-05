import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';
import Icon from './components/Icon';
import ContinueButton from './components/ContinueButton';

/**
 * Empty favorites page.
 */
class EmptyFavorites extends Component {
  static propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  /**
   * Checks if component should be updated.
   * @param {Object} nextProps Next props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.products.length !== nextProps.products.length;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (this.props.products.length) {
      return null;
    }

    return (
      <div className={styles.container}>
        <div className={styles.iconContainer} data-test-id="emptyFavComponent">
          <Icon />
          <I18n.Text string="favorites.empty" className={styles.title} />
        </div>
        <ContinueButton />
      </div>
    );
  }
}

export default EmptyFavorites;
