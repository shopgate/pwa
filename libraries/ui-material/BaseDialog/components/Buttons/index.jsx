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
  actions.map(({ label, action }) => (
    <Button key={label} className={styles.button} flat type="primary" onClick={action}>
      <I18n.Text string={label} />
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
