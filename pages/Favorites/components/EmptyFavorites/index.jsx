import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import styles from './style';
import Icon from './components/Icon';
import ContinueButton from './components/ContinueButton';

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
      <ContinueButton />
    </SurroundPortals>
  </div>
);

export default EmptyFavorites;
