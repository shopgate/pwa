import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The Hint component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Hint = ({ hint }) => {
  if (hint === null) {
    return null;
  }

  return (
    <div className={styles.hint}>
      <I18n.Text string={hint} />
    </div>
  );
};

Hint.propTypes = {
  hint: PropTypes.string,
};

Hint.defaultProps = {
  hint: null,
};

export default Hint;
