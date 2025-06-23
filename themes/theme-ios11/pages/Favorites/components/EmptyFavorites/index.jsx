import React, { useMemo } from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import classNames from 'classnames';
import styles from './style';
import Icon from './components/Icon';

const { svgImages = {} } = themeConfig || {};

/**
 * The Empty Favorites component
 * @return {JSX.Element}
 */
const EmptyFavorites = () => {
  const { emptyFavorites = '' } = svgImages || {};

  const imageSRC = useMemo(() => svgToDataUrl(emptyFavorites),
    [emptyFavorites]);

  return (
    <div className={styles.container}>
      <SurroundPortals portalName={FAVORITES_EMPTY}>
        <div
          className={classNames(styles.iconContainer, 'favorites__empty-favorites__image')}
          data-test-id="emptyFavComponent"
        >
          {emptyFavorites
            ? <img src={imageSRC} alt="" />
            : <Icon />
          }
          <I18n.Text string="favorites.empty" className={styles.title} />
        </div>
      </SurroundPortals>
    </div>
  );
};

export default EmptyFavorites;
