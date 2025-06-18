import React, { useMemo } from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { encodeSVG } from '@shopgate/engage/core/helpers';
import styles from './style';
import { EmptyFavoritesIcon } from './components/Icon';
import ContinueButton from './components/ContinueButton';

const { fullSVGs = {} } = themeConfig || {};

/**
 * The Empty Favorites component
 * @return {JSX.Element}
 */
const EmptyFavorites = () => {
  const { emptyFavorites = '' } = fullSVGs || {};

  const imageSRC = useMemo(() => encodeSVG(emptyFavorites),
    [emptyFavorites]);

  return (
    <div className={styles.container}>
      <SurroundPortals portalName={FAVORITES_EMPTY}>
        <div className={styles.iconContainer} data-test-id="emptyFavComponent">
          {emptyFavorites
            ? <img src={imageSRC} alt="" />
            : <EmptyFavoritesIcon />
          }
          <I18n.Text string="favorites.empty" className={styles.title} />
        </div>
        <ContinueButton />
      </SurroundPortals>
    </div>
  );
};

export default EmptyFavorites;
