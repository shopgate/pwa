import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { Typography } from '@shopgate/engage/components';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { useProfileContext } from './Profile.provider';

const useStyles = makeStyles()({
  root: {
    marginTop: 8,
    [responsiveMediaQuery('<md')]: {
      marginTop: 16,
      marginBottom: 16,
    },
  },
  title: {
    fontWeight: '600',
  },
});

/**
 * @returns {JSX}
 */
const ProfileHeader = () => {
  const { classes } = useStyles();
  const { internalCustomerNumber } = useProfileContext().customer || {};

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="span" color="textPrimary" className={classes.title}>
        {i18n.text('account.profile.customer.number', { customerNumber: internalCustomerNumber })}
      </Typography>
    </div>
  );
};

export default ProfileHeader;
