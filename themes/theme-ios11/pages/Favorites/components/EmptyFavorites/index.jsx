import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import styles from './style';
import { EmptyFavoritesIcon } from './components/Icon';

const { icons } = themeConfig;

/**
 * The Empty Favorites component
 * @return {JSX.Element}
 */
const EmptyFavorites = () => (
  <div className={styles.container}>
    <SurroundPortals portalName={FAVORITES_EMPTY}>
      <div className={styles.iconContainer} data-test-id="emptyFavComponent">
        {icons?.emptyFavorites
          ? <Icon content={icons.emptyFavorites} />
          : <EmptyFavoritesIcon />
        }
        <I18n.Text string="favorites.empty" className={styles.title} />
      </div>
    </SurroundPortals>
  </div>
);

export default EmptyFavorites;
