import React, { useMemo } from 'react';
import { I18n } from '@shopgate/engage/components';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { FAVORITES_EMPTY } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import { makeStyles, useTheme } from '@shopgate/engage/styles';
import Icon from './components/Icon';

const useStyles = makeStyles()(theme => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingBottom: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 36,
    textAlign: 'center',
  },
}));

/**
 * The Empty Favorites component
 * @return {JSX.Element}
 */
const EmptyFavorites = () => {
  const { classes, cx } = useStyles();
  const { svgImages = {} } = useTheme();
  const { emptyFavorites = '' } = svgImages || {};
  const imageSRC = useMemo(() => svgToDataUrl(emptyFavorites), [emptyFavorites]);

  return (
    <div className={classes.container}>
      <SurroundPortals portalName={FAVORITES_EMPTY}>
        <div
          className={cx(classes.iconContainer, 'empty-favorites__image')}
          data-test-id="emptyFavComponent"
        >
          {emptyFavorites
            ? <img src={imageSRC} alt="" />
            : <Icon />}
          <I18n.Text string="favorites.empty" className={classes.title} />
        </div>
      </SurroundPortals>
    </div>
  );
};

export default EmptyFavorites;
