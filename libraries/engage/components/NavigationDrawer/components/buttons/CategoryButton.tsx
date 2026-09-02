import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import ViewListIcon from '@shopgate/pwa-ui-shared/icons/ViewListIcon';
import { NAV_MENU_CATEGORIES } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';

const LABEL = 'navigation.categories';

/**
 * Renders the categories entry of the navigation drawer.
 * @returns The rendered entry.
 */
const CategoryButton = () => {
  const navigate = useNavDrawerNavigate();

  return (
    <SurroundPortals portalName={NAV_MENU_CATEGORIES} portalProps={portalProps}>
      <NavDrawer.Item
        label={LABEL}
        icon={ViewListIcon}
        onClick={navigate(CATEGORY_PATH, LABEL)}
        testId="navDrawerCategoriesButton"
      />
    </SurroundPortals>
  );
};

export default CategoryButton;
