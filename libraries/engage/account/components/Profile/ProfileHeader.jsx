import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
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
    color: 'var(--color-text-high-emphasis)',
    fontSize: 17,
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
      <span className={classes.title}>
        {i18n.text('account.profile.customer.number', { customerNumber: internalCustomerNumber })}
      </span>
    </div>
  );
};

export default ProfileHeader;
