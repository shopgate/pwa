import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import Checkbox from '@shopgate/pwa-ui-shared/Checkbox';
import styles from './style';

/**
 * The Filter Attribute Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({ checked, label, onClick }) => (
  <RippleButton type="plain" onClick={onClick} className={styles.item}>
    <Grid>
      <Grid.Item grow={1} shrink={1}>
        <div className={styles.label}>
          {label}
        </div>
      </Grid.Item>
      <Grid.Item grow={0} shrink={0}>
        <div className={styles.checkbox}>
          <Checkbox checked={checked} />
        </div>
      </Grid.Item>
    </Grid>
  </RippleButton>
);

Item.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  checked: false,
  label: null,
  onClick: () => {},
};

export default Item;
