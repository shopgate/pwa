import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@shopgate/engage/components/v2';
import { AddedTick } from '@shopgate/engage/product/components/AddedTick';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  button: {
    position: 'relative',
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    whiteSpace: 'nowrap',
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&[data-hidden]': {
      opacity: 0,
    },
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    fontSize: '1.5em',
  },
});

/**
 * The add to cart button of the add to cart bar. While the product is added it shows a spinner,
 * after success a tick, then its label again.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const AddToCartButton = ({ disabled, state, onClick }) => {
  const { classes, cx } = useStyles();
  const pending = state === 'pending';
  const added = state === 'added';

  return (
    <Button
      color="cta"
      fullWidth
      className={cx(classes.button, 'theme__product__add-to-cart-bar__add-to-cart-button')}
      onClick={onClick}
      disabled={disabled}
      aria-busy={pending || undefined}
      data-state={state}
      testId="addToCartBarButton"
    >
      <span className={classes.label} data-hidden={pending || added ? 'true' : undefined}>
        {i18n.text('product.add_to_cart')}
      </span>
      {pending && (
        <span className={classes.overlay} aria-hidden>
          <CircularProgress color="inherit" size={20} />
        </span>
      )}
      {added && (
        <AddedTick className={cx(classes.overlay, classes.tick)} />
      )}
    </Button>
  );
};

AddToCartButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  state: PropTypes.oneOf(['idle', 'pending', 'added']).isRequired,
};

export default AddToCartButton;
