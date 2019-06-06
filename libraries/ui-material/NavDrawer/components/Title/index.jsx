import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerTitle = ({ text }) => {
  if (!text.length) {
    return null;
  }

  return (
    <div className={styles} aria-hidden>
      <I18n.Text string={text} />
    </div>
  );
};

NavDrawerTitle.propTypes = {
  text: PropTypes.string,
};

NavDrawerTitle.defaultProps = {
  text: '',
};

export default NavDrawerTitle;
