import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import {
  useAddressBook,
  ADDRESS_TYPE_BILLING,
  ADDRESS_TYPE_SHIPPING,
} from '@shopgate/engage/checkout';
import {
  RippleButton, Card, ContextMenu, Typography,
} from '@shopgate/engage/components';
import iso3166 from '../../../components/Form/Builder/helpers/iso-3166-2';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    width: 'calc(50% - 16px)',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      width: '100%',
    },
  },
  contextMenu: {
    marginRight: -8,
    marginBottom: 4,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      flexDirection: 'column',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  selectButtonColumn: {
    justifyContent: 'flex-end',
    paddingLeft: 8,
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      paddingLeft: 0,
    },
  },
  name: {
    flex: 1,
    fontWeight: theme.typography.fontWeightMedium,
  },
  button: {
    '&&:disabled': {
      padding: '8px 0',
    },
    '&&': {
      marginTop: 8,
      borderRadius: 5,
      padding: 0,
      textTransform: 'none',
    },
  },
  ripple: {
    padding: '8px 16px',
  },
}));

/**
 * @returns {JSX}
 */
const ProfileAddressCard = ({
  contact, deleteContact, editContact, selectContact, selected,
}) => {
  const { classes, cx } = useStyles();
  const { isCheckout, type } = useAddressBook();

  return (
    <Card className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5" component="span" color="textPrimary" className={classes.name}>
          {contact.middleName
            ? `${contact.firstName} ${contact.middleName} ${contact.lastName}`
            : `${contact.firstName} ${contact.lastName}`}
        </Typography>
        <ContextMenu classes={{ container: classes.contextMenu }}>
          <ContextMenu.Item onClick={editContact}>
            {i18n.text('account.profile.address_book.context.edit')}
          </ContextMenu.Item>
          <ContextMenu.Item onClick={deleteContact}>
            {i18n.text('account.profile.address_book.context.remove')}
          </ContextMenu.Item>
        </ContextMenu>
      </div>
      <div className={classes.body}>
        <div className={classes.column}>
          {!isCheckout && contact.emailAddress ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.emailAddress}
            </Typography>
          ) : null}
          {contact.postalCode ||
        contact.region ||
        contact.city ||
        contact.country ? (
          <Typography variant="body1" component="span" color="textSecondary">
            {i18n.text('checkout.billing.address', {
              postalCode: contact.postalCode || '',
              region: iso3166?.[contact.country]?.divisions?.[contact.region] || contact.region || '',
              city: contact.city || '',
              country: contact.country || '',
            })}
          </Typography>
            ) : null}
          {contact.address1 ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.address1}
            </Typography>
          ) : null}
          {contact.address2 ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.address2}
            </Typography>
          ) : null}
          {contact.address3 ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.address3}
            </Typography>
          ) : null}
          {contact.address4 ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.address4}
            </Typography>
          ) : null}
          {!isCheckout && contact.mobile ? (
            <Typography variant="body1" component="span" color="textSecondary">
              {contact.mobile}
            </Typography>
          ) : null}
          {(!isCheckout || type === ADDRESS_TYPE_BILLING) && contact.isDefaultBilling ? (
            <Typography variant="body2" component="span" color="textSecondary">
              {i18n.text('account.profile.address_book.default_billing')}
            </Typography>
          ) : null}
          {(!isCheckout || type === ADDRESS_TYPE_SHIPPING) && contact.isDefaultShipping ? (
            <Typography variant="body2" component="span" color="textSecondary">
              {i18n.text('account.profile.address_book.default_shipping')}
            </Typography>
          ) : null}
        </div>
        <div className={cx(classes.column, classes.selectButtonColumn)}>
          { isCheckout ? (
            <RippleButton
              className={classes.button}
              rippleClassName={classes.ripple}
              type="secondary"
              disabled={selected}
              onClick={selectContact}
            >
              <Typography variant="body2" component="span">
                {i18n.text(`account.profile.address_book.${selected ? 'selected' : 'select'}`)}
              </Typography>
            </RippleButton>
          ) : null}
        </div>
      </div>

    </Card>
  );
};
ProfileAddressCard.propTypes = {
  contact: PropTypes.shape().isRequired,
  deleteContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  selectContact: PropTypes.func,
  selected: PropTypes.bool,
};

ProfileAddressCard.defaultProps = {
  selectContact: null,
  selected: false,
};

export default ProfileAddressCard;
