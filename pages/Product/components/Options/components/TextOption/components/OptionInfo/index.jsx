import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The text option info component
 * @param {Object} props The component props
 * @return {JSX}
 */
const OptionInfo = ({ required, label, price }) => {
  if (!required && !price.price) {
    return null;
  }

  return (
    <Grid className={styles.info}>
      {required &&
        <Grid.Item className={styles.required}>
          <I18n.Text string="common.required" />
        </Grid.Item>
      }
      {!!price.price &&
        <Grid.Item grow={1} className={styles.price}>
          {`${label}: `}
          <I18n.Price
            currency={price.currency}
            price={price.price}
          />
        </Grid.Item>
      }
    </Grid>
  );
};

OptionInfo.propTypes = {
  label: PropTypes.string.isRequired,
  price: PropTypes.shape({
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
  }).isRequired,
  required: PropTypes.bool.isRequired,
};

export default memo(OptionInfo);

export { OptionInfo };
