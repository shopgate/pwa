import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@shopgate/engage/components';
import { I18n } from '@shopgate/engage/components';
import { ProductContext } from '../../../../../../context';
import styles from './style';

/**
 * The text option info component
 * @param {Object} props The component props
 * @return {JSX}
 */
const OptionInfo = ({ required, label, price }) => {
  if (!required && !price) {
    return null;
  }

  return (
    <ProductContext.Consumer>
      {({ currency }) => (
        <Grid className={styles.info}>
          {required &&
            <Grid.Item className={styles.required}>
              <I18n.Text string="common.required" />
            </Grid.Item>
          }
          {!!price &&
            <Grid.Item grow={1} className={styles.price}>
              {`${label}: `}
              <I18n.Price
                currency={currency}
                price={price}
              />
            </Grid.Item>
          }
        </Grid>
      )}
    </ProductContext.Consumer>
  );
};

OptionInfo.propTypes = {
  label: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
};

export default memo(OptionInfo);

export { OptionInfo };
