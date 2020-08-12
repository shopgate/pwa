import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { useProfileContext } from './Profile.provider';

const styles = {
  root: css({
    marginTop: 8,
    [responsiveMediaQuery('<md')]: {
      marginTop: 16,
      marginBottom: 16,
    },
  }),
  title: css({
    color: 'var(--color-text-high-emphasis)',
    fontSize: 17,
    fontWeight: '600',
  }).toString(),
};

/**
 * @returns {JSX}
 */
const ProfileHeader = () => {
  const { internalCustomerNumber } = useProfileContext().customer || {};

  return (
    <div className={styles.root}>
      <span className={styles.title}>
        {i18n.text('account.profile.customer.number', { customerNumber: internalCustomerNumber })}
      </span>
    </div>
  );
};

export default ProfileHeader;
