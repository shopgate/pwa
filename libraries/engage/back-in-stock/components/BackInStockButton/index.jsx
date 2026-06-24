import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import {
  Link, CheckedIcon, Button, NotificationIcon, Typography,
} from '@shopgate/engage/components';
import { BACK_IN_STOCK_PATTERN } from '@shopgate/engage/back-in-stock/constants';
import { i18n } from '@shopgate/engage/core/helpers';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  button: {
    color: theme.palette.warning.main,
    width: '100%',
  },
  backInStockMessageContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 'auto',
  },
  rightAligned: {
    display: 'inline-block',
    textAlign: 'right',
  },
  backInStockMessage: {
    verticalAlign: 'middle',
  },
  icon: {
    marginRight: 4,
    marginTop: -1,
    verticalAlign: 'middle',
    flexShrink: 0,
    alignSelf: 'flex-start',
    display: 'inline-flex',
  },
  iconCentered: {
    alignSelf: 'center',
    marginLeft: '-2px',
    marginRight: '8px',
  },
}));
/**
 * This component renders a button to subscribe a product or a hint
 * that the product is already subscribed
 * @param {Object} props The component props
 * @param {boolean} props.isLinkToBackInStockEnabled Whether the link to the back in
 * stock page is active
 * @param {boolean} props.stopPropagation Stop event propagation
 * @param {string} props.productId The product id
 * @param {Object} props.subscription The subscription
 * @param {Function} props.addBackInStockSubscription Add product to back in stock list
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @return {JSX.Element}
 */
const BackInStockButton = ({
  productId,
  isLinkToBackInStockEnabled = false,
  subscription,
  stopPropagation = false,
  addBackInStockSubscription,
  grantPushPermissions,
  alignRight,
  showAsButton,
}) => {
  const { classes, cx, theme } = useStyles();
  const handleClick = useCallback(async (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    const allowed = await grantPushPermissions({
      useRationaleModal: true,
      useSettingsModal: true,
      rationaleModal: {
        message: 'back_in_stock.rationale.message',
        confirm: 'back_in_stock.rationale.confirm',
        dismiss: 'common.cancel',
      },
      meta: {
        context: 'backInStock',
        usesSoftPushOptIn: false,
        permission: 'push',
      },
    });
    if (allowed) {
      addBackInStockSubscription({ productId });
    }
  }, [addBackInStockSubscription, grantPushPermissions, productId, stopPropagation]);

  if (subscription?.status === 'active') {
    return (
      <Link
        href={BACK_IN_STOCK_PATTERN}
        disabled={!isLinkToBackInStockEnabled}
        className={cx(
          classes.backInStockMessageContainer,
          { [classes.rightAligned]: alignRight }
        )}
        tag="span"
      >
        <CheckedIcon
          color={theme.palette.success.main}
          className={alignRight ? classes.icon : cx(classes.iconCentered, classes.icon)}
        />
        <Typography variant="body2" component="span" className={classes.backInStockMessage}>
          {i18n.text('back_in_stock.we_will_remind_you')}
        </Typography>
      </Link>
    );
  }

  if (showAsButton) {
    return (
      <Button
        type="primary"
        tabIndex={0}
        onClick={handleClick}
        className={classes.button}
      >
        <Typography variant="body2" component="span" className={classes.buttonText}>
          {i18n.text('back_in_stock.get_notified')}
        </Typography>
      </Button>
    );
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events
    <a
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={cx(
        classes.button,
        { [classes.rightAligned]: alignRight }
      )}
    >
      <NotificationIcon color={theme.palette.primary.main} className={classes.icon} />
      <span className={classes.buttonText}>
        {i18n.text('back_in_stock.get_notified')}
      </span>
    </a>
  );
};

BackInStockButton.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  alignRight: PropTypes.bool,
  isLinkToBackInStockEnabled: PropTypes.bool,
  productId: PropTypes.string,
  showAsButton: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  subscription: PropTypes.shape(),
};

BackInStockButton.defaultProps = {
  stopPropagation: false,
  isLinkToBackInStockEnabled: false,
  showAsButton: false,
  alignRight: false,
  subscription: null,
  productId: null,
};

export default connect(BackInStockButton);
