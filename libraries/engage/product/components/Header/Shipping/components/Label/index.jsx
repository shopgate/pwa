import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  text: {
    color: theme.palette.success.main,
  },
}));

/**
 * The Shipping Label component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Label = ({ className, price, currency }) => {
  const { classes, cx } = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <div role="text" className={cx(classes.text, className)}>
      {price > 0 ? (
        <I18n.Text string="shipping.cost">
          <I18n.Price forKey="price" price={price} currency={currency} />
        </I18n.Text>
      ) : (
        <I18n.Text string="shipping.free" />
      )}
    </div>
  );
};

Label.propTypes = {
  currency: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Label.defaultProps = {
  className: '',
};

export default Label;
