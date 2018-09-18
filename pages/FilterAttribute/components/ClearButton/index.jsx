import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Button from '@shopgate/pwa-ui-shared/Button';
import connect from './connector';
import styles from './style';

/**
 * The Filter Attribute Clear Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ClearButton = ({ disabled, currentAttribute, removeTemporaryFilter }) => (
  <div className={styles}>
    <Button
      flat
      type="regular"
      onClick={() => removeTemporaryFilter(currentAttribute.id)}
      disabled={disabled}
      testId="clearAllButton"
    >
      <I18n.Text string="filter.clear" />
    </Button>
  </div>
);

ClearButton.propTypes = {
  currentAttribute: PropTypes.shape().isRequired,
  disabled: PropTypes.bool,
  removeTemporaryFilter: PropTypes.func,
};

ClearButton.defaultProps = {
  disabled: false,
  removeTemporaryFilter: () => {},
};

export default connect(ClearButton);
