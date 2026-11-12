import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import { ACCOUNT_PATH } from '@shopgate/engage/account/constants';
import { useNavDrawerNavigate } from '../../hooks';

const LABEL = 'navigation.your_account';

/**
 * Renders the account entry of the navigation drawer.
 * @returns The rendered entry.
 */
const AccountButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <NavDrawer.Item
      label={LABEL}
      icon={AccountBoxIcon}
      onClick={navigate(ACCOUNT_PATH, LABEL)}
      testId="navDrawerAccountButton"
    />
  );
};

export default AccountButton;
