import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavigatorTitle = ({ title }) => (
  <div className={styles}>
    <I18n.Text string={title} />
  </div>
);

NavigatorTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default NavigatorTitle;
