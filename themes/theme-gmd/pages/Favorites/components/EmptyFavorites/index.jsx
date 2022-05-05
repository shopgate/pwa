import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import styles from './style';
import Icon from './components/Icon';

/**
 * @return {JSX}
 */
const EmptyFavorites = () => (
  <div className={styles.container}>
    <SurroundPortals portalName={FAVORITES_EMPTY}>
      <div className={styles.iconContainer} data-test-id="emptyFavComponent">
        <Icon />
        <I18n.Text string="favorites.empty" className={styles.title} />
      </div>
    </SurroundPortals>
  </div>
);

export default EmptyFavorites;
