import React, { memo } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
import styles from '../../style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Buttons = ({ actions }) =>
  actions.map(({ label, action, type = 'normal' }) => (
    <Button
      key={label}
      className={`${styles.button} ${type === 'primary' ? styles.buttonPrimary : ''}`}
      type="primary"
      onClick={action}
      flat
    >
      <I18n.Text className={styles.buttonText} string={label} />
    </Button>
  ));

Buttons.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  })),
};

Buttons.defaultProps = {
  actions: [],
};

export default memo(Buttons);
