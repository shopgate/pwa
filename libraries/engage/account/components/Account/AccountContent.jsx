import React, { Fragment } from 'react';
import { I18n } from '@shopgate/engage/components';
import { headline } from './AccountContent.style';

/**
 * @returns {JSX}
 */
const AccountContent = () => (
  <Fragment>
    <div className={headline}>
      <I18n.Text string="titles.account" />
    </div>
  </Fragment>
);

export default AccountContent;
